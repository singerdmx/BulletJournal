package com.bulletjournal.messaging;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities;
import org.springframework.core.io.ByteArrayResource;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PdfConverter {
  private static final PdfRendererBuilder BUILDER = new PdfRendererBuilder();

  public static ByteArrayResource projectItemHtmlToPdf(String html) throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();

    // html to xhtml
    Document document = Jsoup.parse(html);
    document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
    document.outputSettings().escapeMode(Entities.EscapeMode.xhtml);

    BUILDER.withHtmlContent(document.html(), null);
    BUILDER.toStream(os);
    BUILDER.run();
    return new ByteArrayResource(os.toByteArray());
  }
}
