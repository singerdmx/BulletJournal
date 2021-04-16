package com.bulletjournal.messaging;

import com.openhtmltopdf.java2d.api.BufferedImagePageProcessor;
import com.openhtmltopdf.java2d.api.Java2DRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities;
import org.springframework.core.io.ByteArrayResource;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class OpenHtmlConverter {
  private static final PdfRendererBuilder PDF_BUILDER = new PdfRendererBuilder();
  private static final Java2DRendererBuilder IMAGE_BUILDER = new Java2DRendererBuilder();

  /**
   * convert project item as pdf
   */
  public static ByteArrayResource projectItemHtmlToPdf(String html) throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();

    PDF_BUILDER.withHtmlContent(htmlToXhtml(html), null);
    PDF_BUILDER.toStream(os);
    PDF_BUILDER.run();
    return new ByteArrayResource(os.toByteArray());
  }

  /**
   * convert project item as `png` image
   * <p>
   * <b>Note</b>
   *  Converted project item image won't contain any [img] tag.
   *  - `openhtmltopdf-java2d` image converter only supports limit image format,
   *  - image inside [img] may cause unexpected error when export project item as image
   * </p>
   */
  public static ByteArrayResource projectItemHtmlToImage(String html, double scale) throws Exception {
    ByteArrayOutputStream os = new ByteArrayOutputStream();

    String htmlWithoutImage = htmlToXhtml(html)
            .replaceAll("<img .*? ((/>)|(</img>))", "");

    IMAGE_BUILDER.withHtmlContent(htmlWithoutImage, null);
    IMAGE_BUILDER.useFastMode();
    IMAGE_BUILDER.useEnvironmentFonts(true);

    BufferedImagePageProcessor bufferedImagePageProcessor = new BufferedImagePageProcessor(
            BufferedImage.TYPE_INT_RGB, scale);

    IMAGE_BUILDER.toSinglePage(bufferedImagePageProcessor);
    IMAGE_BUILDER.runFirstPage();

    ImageIO.write(bufferedImagePageProcessor.getPageImages().get(0), "png", os);
    return new ByteArrayResource(os.toByteArray());
  }

  public static ByteArrayResource projectItemHtmlToImageForMobile(String html) throws Exception {
      return projectItemHtmlToImage(html, 1);
  }

  public static ByteArrayResource projectItemHtmlToImageForPC(String html) throws Exception {
    return projectItemHtmlToImage(html, 5);
  }

  /**
   * convert coming html format info as xhtml
   */
  private static String htmlToXhtml(String html) {
    Document document = Jsoup.parse(html);
    document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
    document.outputSettings().escapeMode(Entities.EscapeMode.xhtml);
    return document.html();
  }
}
