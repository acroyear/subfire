import { Tea } from "@subfire/core";
// TODO: move me to @subfire/core
export const AuthExchangeActions = {
  sourceSubmit: function (code) {
    try {
      const transmissionDigits = code.substring(0, 5);
      // AH - bypasses the store by just going to local storage
      const payloadData = {
        configs: window.localStorage["subsonic.credentials"],
      };
      const payload = Tea.encrypt(JSON.stringify(payloadData), code);
      const myHeaders = new Headers();

      const fd = new FormData();
      fd.set("code", transmissionDigits);
      fd.set("payload", payload);

      const myInit = {
        method: "POST",
        headers: myHeaders,
        mode: "cors",
        cache: "default",
        body: fd,
      };
      return fetch("https://subfiresuite.com/sflink/sflink.php", myInit);
    } catch (e) {
      window.console.error("oops", e);
      return new Promise((res, rej) => {
        rej(e);
      });
    }
  },

  clientRequest: function (code) {
    const transmissionDigits = code.substring(0, 5);

    const myHeaders = new Headers();
    const myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "default",
    };

    return fetch(
      "https://subfiresuite.com/sflink/sflink.php?code=" + transmissionDigits,
      myInit
    );
  },

  allocateDigits: function () {
    const length = 7;
    const randNumber = Math.floor(
      Math.random() * (9 * Math.pow(10, length - 1) - 1) +
        Math.pow(10, length - 1)
    );
    const digits = "" + randNumber;
    return digits;
  },
};

export default AuthExchangeActions;
