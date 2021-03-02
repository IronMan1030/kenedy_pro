function create_oauth2_url() {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  let client_id = "14205368595-lukg4cg87gim7e73bm8fp57lmdqrfpnb.apps.googleusercontent.com";
  let redirectUri = chrome.identity.getRedirectURL();
  let response_type = "id_token";
  let state = "kenedy";
  let scope = "email";
  let prompt = "consent";
  let auth_url =
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectUri +
    "&response_type=" +
    response_type +
    "&scope=" +
    scope +
    "&state=" +
    state +
    "&prompt" +
    prompt +
    "&nonce=" +
    nonce;
  console.log(auth_url);
  return auth_url;
}

// window.chrome.runtime.sendMessage(
//   EXTENSION_ID,
//   { message: "---" }, // jsonable message
//   (result) => {
//     if (!window.chrome.runtime.lastError) {
//       // do you work, that's it. No more unchecked error
//     }
//   }
// );

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "startRecording") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs.length) {
        return;
      }
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, { message: "startRecording" });
    });
  } else if (request.type === "stopRecording") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs.length) {
        return;
      }
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, { message: "stopRecording" });
    });
  } else if (request.type === "gmail_login") {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_oauth2_url(),
        interactive: true,
      },
      function (redirect_url) {
        console.log(redirect_url);
        let id_token = redirect_url.substring(redirect_url.indexOf("id_token=") + 9);
        id_token = id_token.substring(0, id_token.indexOf("&"));
        console.log(id_token);
        if (id_token) {
          chrome.storage.local.set({ id_token: id_token });
          sendResponse({ result: 1, data: id_token });
        } else {
          sendResponse({ result: 0, msg: "fail" });
        }
      }
    );
    return true;
  }
  // if (request.type === "sending") {
  //   console.log(request.data);
  //   chrome.runtime.sendMessage({
  //     type: "sendingAudio",
  //     data: request.data,
  //   });
  // }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("./index.html"),
  });
});
