import HtmlDiff from 'htmldiff-js';

export const getHtmlDiff = (oldHtml, newHtml) => {
    return HtmlDiff.execute(oldHtml, newHtml);
}

