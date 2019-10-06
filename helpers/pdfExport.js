const request = require("request");

const API2PDF_BASE_ENDPOINT = "https://v2018.api2pdf.com";
const API2PDF_CHROME_HTML = API2PDF_BASE_ENDPOINT + "/chrome/html";

headlessChromeFromHtml = (html, filename) => {
  var payload = {
    html: html,
    inlinePdf: false,
    fileName: filename,
    options: {
      preferCSSPageSize: true,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      printBackground: true,
    },
  };

  return makeRequest(API2PDF_CHROME_HTML, payload);
};

makeRequest = (endpoint, payload) => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: endpoint,
        body: JSON.stringify(payload),
        headers: { Authorization: process.env.API2PDF },
      },
      (e, r, body) => {
        var result = JSON.parse(body);
        if (r.statusCode == 200 && result.success == true) {
          return resolve(result);
        } else {
          return reject(result);
        }
      },
    );
  });
};

renderQuoteToHtml = quote => {
  var baseHtml =
    '<html style"margin: 0; padding: 0;width: 100%;"> <head><meta charset="UTF-8"> <link rel="stylesheet" href="https://firebasestorage.googleapis.com/v0/b/quotes-1566472403403.appspot.com/o/css%2Fstyle.css?alt=media&token=3d37f165-76b0-4cd2-9474-549ff762ec27"/></head><body>';
  baseHtml += '<div style="position: relative;">';
  baseHtml += titelBildRender(quote.Reciever, quote.Sender, quote.created);
  baseHtml += '<div class="quoteBody">';
  baseHtml += servicesRender(quote.Services);
  baseHtml += priceTableRender(quote.Services, quote.PriceNotes);
  baseHtml += "</div></div></body></html>";

  return baseHtml;
};

titelBildRender = (user, sender, created) => {
  var base =
    '<div class="Main-background-image"> <div class="inner-section"> <h2 class="date">' +
    created +
    '</h2><h2 class="quote-reciever-name"> לכבוד:' +
    user.name +
    '</h2><div class="App-logo" style="height:200px">';
  if (user.logo) {
    base += "<img src=" + user.logo + ' alt="logo" height="200" />';
  }
  base +=
    '</div><h3 class="qoute-greetings">מצורפת הצעת מחיר, נשמח לעמוד לרשותכם ולספק מענה לכל שאלה. נקודה.</h3> <div class="quote-sender"><h5>בברכה,</h5><h5>' +
    sender.displayName +
    "</h5><h5>" +
    sender.email +
    "</h5></div></div></div>";

  return base;
};

servicesRender = services => {
  var base = "";
  services.map(service => {
    base +=
      '<div class="single-service"><h2 class="single-service-header">' +
      service.content.header +
      '</h2><ul class="single-service-body">';
    if (service.content.body.length) {
      service.content.body.map(line => {
        base += '<li class="single-service-li">' + line.value + "</li>";
      });
    }
    base += "</ul></div>";
  });
  return base;
};

priceTableRender = (services, priceNotes) => {
  var base =
    '<div class="priceBlock"><div class="single-service"><h2 class="single-service-header">תמחור והערות</h2><ul class="single-service-body">';

  if (priceNotes) {
    Object.entries(priceNotes).map(pair => {
      const value = pair[1];
      if (Array.isArray(pair[1])) return;
      base += '<li class="single-service-li">' + value + "</li>";
    });
  }

  services.map(service => {
    if (!service.content.priceBlock.notes) {
      return;
    }
    base +=
      ' <li class="single-service-li">' +
      service.content.priceBlock.notes +
      "</li>";
  });

  base += "</div>";
  base +=
    '<table class="priceTable"><tbody><tr class="firstRow"> <th key="service">שירות</th><th key="price">עלות</th><th key="routine">מחזור</th></tr>';

  services.map(service => {
    let priceBlock = service.content.priceBlock;
    var month = priceBlock.monthly ? "חודשי" : "חד פעמי";

    base += '<tr class="priceTable"><td>' + priceBlock.header + "</td>";

    base += "<td>" + priceBlock.price + priceBlock.currency + " </td>";
    base += "<td>" + month + "</td></tr>";
  });

  if (priceNotes && priceNotes.specialNotes && priceNotes.specialNotes.length) {
    specialNotes.map((note, index) => {
      var nMonth = note.monthly ? "חודשי" : "חד פעמי";
      base += '<tr class="priceTable"><td>' + note.header + "</td>";
      base += "<td>" + note.price + note.currency + " </td>";
      base += "<td>" + nMonth + "</td></tr>";
    });
  }

  base += "</tbody></table></div>";

  return base;
};

module.exports = {
  pdfExport: quote => {
    return headlessChromeFromHtml(renderQuoteToHtml(quote), "nekuda.pdf")
      .then(function(result) {
        return result;
      })
      .catch(error => {
        console.log(error);
      });
  },
};
