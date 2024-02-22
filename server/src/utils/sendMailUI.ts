type Props = {
  emailType: string;
  frontendDomain: string;
  hashedToken: string;
  email: string;
};

export const getMailUI = ({
  emailType,
  frontendDomain,
  hashedToken,
  email,
}: Props) => {
  const url = `${frontendDomain}/${emailType}?token=${hashedToken}`;
  const heading =
    emailType === "verify"
      ? " Verify your email address"
      : "Reset your password";
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${heading}</title>
      <link rel="stylesheet" href="hi.css" />
      <style>
        *,
        ::before,
        ::after {
          box-sizing: border-box;
          /* 1 */
          border-width: 0;
          /* 2 */
          border-style: solid;
          /* 2 */
          border-color: #e5e7eb;
          /* 2 */
        }
  
        ::before,
        ::after {
          --tw-content: "";
        }
  
       
        html,
        :host {
          line-height: 1.5;
          /* 1 */
          -webkit-text-size-adjust: 100%;
          /* 2 */
          -moz-tab-size: 4;
          /* 3 */
          tab-size: 4;
          /* 3 */
          font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          /* 4 */
          font-feature-settings: normal;
          /* 5 */
          font-variation-settings: normal;
          /* 6 */
          -webkit-tap-highlight-color: transparent;
          /* 7 */
        }
  
       
        body {
          margin: 0;
          line-height: inherit;
        }
  
        hr {
          height: 0;
          color: inherit;
          border-top-width: 1px;
        }

  
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-size: inherit;
          font-weight: inherit;
        }
  
        
  
        b,
        strong {
          font-weight: bolder;
        }
  
     
        code,
        kbd,
        samp,
        pre {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-feature-settings: normal;
          font-variation-settings: normal;
          font-size: 1em;
        }

  
        small {
          font-size: 80%;
        }
  
  
        table {
          text-indent: 0;
          /* 1 */
          border-color: inherit;
          /* 2 */
          border-collapse: collapse;
          /* 3 */
        }
  
        button,
        input,
        optgroup,
        select,
        textarea {
          font-family: inherit;
          /* 1 */
          font-feature-settings: inherit;
          /* 1 */
          font-variation-settings: inherit;
          /* 1 */
          font-size: 100%;
          /* 1 */
          font-weight: inherit;
          /* 1 */
          line-height: inherit;
          /* 1 */
          color: inherit;
          /* 1 */
          margin: 0;
          /* 2 */
          padding: 0;
          /* 3 */
        }

  
        button,
        select {
          text-transform: none;
        }

  
        button,
        [type="button"],
        [type="reset"],
        [type="submit"] {
          -webkit-appearance: button;
          /* 1 */
          background-color: transparent;
          /* 2 */
          background-image: none;
          /* 2 */
        }
  
  
        :-moz-focusring {
          outline: auto;
        }
  
  
        ::-webkit-inner-spin-button,
        ::-webkit-outer-spin-button {
          height: auto;
        }
 
  
        [type="search"] {
          -webkit-appearance: textfield;
          /* 1 */
          outline-offset: -2px;
          /* 2 */
        }

  
        ::-webkit-search-decoration {
          -webkit-appearance: none;
        }
  
  
        ::-webkit-file-upload-button {
          -webkit-appearance: button;
          /* 1 */
          font: inherit;
          /* 2 */
        }
  
  
  
        summary {
          display: list-item;
        }

  
        blockquote,
        dl,
        dd,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        hr,
        figure,
        p,
        pre {
          margin: 0;
        }
  
        fieldset {
          margin: 0;
          padding: 0;
        }
  
        legend {
          padding: 0;
        }
  
        ol,
        ul,
        menu {
          list-style: none;
          margin: 0;
          padding: 0;
        }

  
        dialog {
          padding: 0;
        }

  
        textarea {
          resize: vertical;
        }
  
        input::placeholder,
        textarea::placeholder {
          opacity: 1;
          /* 1 */
          color: #9ca3af;
          /* 2 */
        }
  
        button,
        [role="button"] {
          cursor: pointer;
        }
  
        :disabled {
          cursor: default;
        }
  
        img,
        svg,
        video,
        canvas,
        audio,
        iframe,
        embed,
        object {
          display: block;
          /* 1 */
          vertical-align: middle;
          /* 2 */
        }
  
        /*
  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
  */
  
        img,
        video {
          max-width: 100%;
          height: auto;
        }
  
        /* Make elements with the HTML hidden attribute stay hidden by default */
  
        [hidden] {
          display: none;
        }
  
        *,
        ::before,
        ::after {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-rotate: 0;
          --tw-skew-x: 0;
          --tw-skew-y: 0;
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
          --tw-scroll-snap-strictness: proximity;
          --tw-gradient-from-position: ;
          --tw-gradient-via-position: ;
          --tw-gradient-to-position: ;
          --tw-ordinal: ;
          --tw-slashed-zero: ;
          --tw-numeric-figure: ;
          --tw-numeric-spacing: ;
          --tw-numeric-fraction: ;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-color: rgb(59 130 246 / 0.5);
          --tw-ring-offset-shadow: 0 0 #0000;
          --tw-ring-shadow: 0 0 #0000;
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-blur: ;
          --tw-brightness: ;
          --tw-contrast: ;
          --tw-grayscale: ;
          --tw-hue-rotate: ;
          --tw-invert: ;
          --tw-saturate: ;
          --tw-sepia: ;
          --tw-drop-shadow: ;
          --tw-backdrop-blur: ;
          --tw-backdrop-brightness: ;
          --tw-backdrop-contrast: ;
          --tw-backdrop-grayscale: ;
          --tw-backdrop-hue-rotate: ;
          --tw-backdrop-invert: ;
          --tw-backdrop-opacity: ;
          --tw-backdrop-saturate: ;
          --tw-backdrop-sepia: ;
        }
  
        ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-rotate: 0;
          --tw-skew-x: 0;
          --tw-skew-y: 0;
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
          --tw-scroll-snap-strictness: proximity;
          --tw-gradient-from-position: ;
          --tw-gradient-via-position: ;
          --tw-gradient-to-position: ;
          --tw-ordinal: ;
          --tw-slashed-zero: ;
          --tw-numeric-figure: ;
          --tw-numeric-spacing: ;
          --tw-numeric-fraction: ;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-color: rgb(59 130 246 / 0.5);
          --tw-ring-offset-shadow: 0 0 #0000;
          --tw-ring-shadow: 0 0 #0000;
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-blur: ;
          --tw-brightness: ;
          --tw-contrast: ;
          --tw-grayscale: ;
          --tw-hue-rotate: ;
          --tw-invert: ;
          --tw-saturate: ;
          --tw-sepia: ;
          --tw-drop-shadow: ;
          --tw-backdrop-blur: ;
          --tw-backdrop-brightness: ;
          --tw-backdrop-contrast: ;
          --tw-backdrop-grayscale: ;
          --tw-backdrop-hue-rotate: ;
          --tw-backdrop-invert: ;
          --tw-backdrop-opacity: ;
          --tw-backdrop-saturate: ;
          --tw-backdrop-sepia: ;
        }
  
        .my-4 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
  
        .mt-6 {
          margin-top: 1.5rem;
        }
  
        .mt-8 {
          margin-top: 2rem;
        }
  
        .flex {
          display: flex;
        }
  
        .w-full {
          width: 100%;
        }
  
        .flex-col {
          flex-direction: column;
        }
  
        .items-center {
          align-items: center;
        }
  
        .justify-center {
          justify-content: center;
        }
  
        .rounded {
          border-radius: 0.25rem;
        }
  
        .bg-blue-600 {
          --tw-bg-opacity: 1;
          background-color: rgb(37 99 235 / var(--tw-bg-opacity));
        }
  
        .px-12 {
          padding-left: 3rem;
          padding-right: 3rem;
        }
  
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
  
        .text-center {
          text-align: center;
        }
  
        .text-3xl {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
  
        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
  
        .font-semibold {
          font-weight: 600;
        }
  
        .text-blue-700 {
          --tw-text-opacity: 1;
          color: rgb(29 78 216 / var(--tw-text-opacity));
        }
  
        .text-white {
          --tw-text-opacity: 1;
          color: rgb(255 255 255 / var(--tw-text-opacity));
        }
  
        .underline {
          text-decoration-line: underline;
        }
      </style>
    </head>
    <body>
      <section class="flex justify-center items-center flex-col w-full mt-6">
        <h1 class="text-3xl text-center font-semibold">
        ${heading}
        </h1>
        <p class="mt-6">
          You have entered <strong>${email}</strong> as the email
          address for your account.
        </p>
        <p>Please confirm this email address by clicking the button below</p>
        <a href="${url}" class="my-4 bg-blue-600 text-white px-12 py-2 rounded text-lg">
          Confirm
        </a>
        <p class="mt-8">Or copy and paste this link into your browser</p>
        <a href="${url}" class="text-blue-700 underline"> ${url} </a>
      </section>
    </body>
  </html>
  `;
};
