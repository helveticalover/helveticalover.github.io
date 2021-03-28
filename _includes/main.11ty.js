exports.render = function(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tiffany Li</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
  <style>
    body, html {
      min-width: 100%;
      min-height: 100%;
      margin: 0;
      padding: 0;
      font-family: "Gill Sans", "Gill Sans MT", Calibri, sans-serif;
      font-size: 16px;
    }
    .content {
      width: 100%;
      padding: 10px 1.5em;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      margin: 50 auto;
    }
    .header {
      margin: 0;
      padding: 25.5px;
    }
    .center {
      margin-left: 0;
      margin-right: 0;
      text-align: center;
      width: 100%;
    }
    .title {
      height: 120px;
    }
    .title img {
      height: 100%;
      box-sizing: inherit;
      vertical-align: top;
      display: inline;
    }
    nav {
      margin: 20px 0px;
    }
    nav ul {
      padding: 0;
    }
    nav li {
      display: inline;
    }
    nav a {
      display: inline-block;
      padding: 10px;
    }
    .mobile-expand {
      display: none;
    }
    .mobile-expand-lbl {
      display: none;
      cursor: pointer;
      transition: all 0.25s ease-out;
    }
    .mobile-expand-lbl:hover {
      color: #7C5A0B;
    }
    .mobile-expand-content {
      max-height: auto;
      overflow: hidden;
      transition: max-height .25s ease-in-out;
    }
    .mobile-expand:checked + .mobile-expand-lbl + .mobile-expand-content {
      max-height: 100vh;
    }
    @media only screen and (max-width: 768px) {
      .content {
        width: 100%;
      }
      .nav li {
        display: inline-block;
        width: 100%;
      }
      .mobile-expand-lbl {
        display: inline-block;
      }
      .mobile-expand-content {
        max-height: 0px;
      }
    }

    .gallery {
      display: flex;
      flex-wrap: wrap;
    }
    .gallery picture {
      margin: 0;
    }
    .gallery img {
      object-fit: cover;
      padding: 0;
    }
    
  </style>
</head>
<body>
  <div class="header">
    <div class="center title">
      <a href="#">
        <img src="/static/cgpicon.png">
      </a>
    </div>
    <nav class="center">
      <div class="wrap-mobile-collapsible">
        <input id="id_nav-collapsible" class="mobile-expand" type="checkbox">
        <label for="id_nav-collapsible" class="mobile-expand-lbl center" data-target="id_nav"><i class="material-icons">menu</i></label>
        <div class="mobile-expand-content">
          <ul class="nav" id="id_nav">
            <li><a href="#">Projects</a></li>
            <li><a href="#">Illustrations</a></li>
            <li><a href="#">Video</a></li>
            <li><a href="#">About Me</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div class="content">
    ${data.content}
  </div>
</body>
</html>`;
}

module.exports = exports;