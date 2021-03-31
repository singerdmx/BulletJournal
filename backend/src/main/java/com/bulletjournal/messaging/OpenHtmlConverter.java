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
   */
  public static ByteArrayResource projectItemHtmlToImage(String html) throws Exception {
    ByteArrayOutputStream os = new ByteArrayOutputStream();

    IMAGE_BUILDER.withHtmlContent(htmlToXhtml(html), null);
    IMAGE_BUILDER.useFastMode();
    IMAGE_BUILDER.useEnvironmentFonts(true);

    BufferedImagePageProcessor bufferedImagePageProcessor = new BufferedImagePageProcessor(
            BufferedImage.TYPE_INT_RGB, 50.0);

    IMAGE_BUILDER.toSinglePage(bufferedImagePageProcessor);
    IMAGE_BUILDER.runFirstPage();

    ImageIO.write(bufferedImagePageProcessor.getPageImages().get(0), "png", os);
    return new ByteArrayResource(os.toByteArray());
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
