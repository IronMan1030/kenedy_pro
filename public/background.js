function create_oauth2_url(clientID) {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  let redirectUri = chrome.identity.getRedirectURL();

  let response_type = "id_token";
  let state = "Kennedy";
  let scope = "openid profile email";
  let prompt = "consent";
  let auth_url =
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
    clientID +
    "&redirect_uri=" +
    redirectUri +
    "&response_type=" +
    response_type +
    "&scope=" +
    scope +
    "&state=" +
    state +
    "&prompt=" +
    prompt +
    "&nonce=" +
    nonce;
  return auth_url;
}
const currentTab = [];
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "gmail_login") {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_oauth2_url(request.clientID),
        interactive: true,
      },
      function (redirect_url) {
        console.log(redirect_url);
        let id_token = redirect_url.substring(redirect_url.indexOf("id_token=") + 9);
        id_token = id_token.substring(0, id_token.indexOf("&"));
        if (id_token) {
          console.log(id_token);
          sendResponse({ result: 1, data: id_token });
        } else {
          sendResponse({ result: 0, msg: "fail" });
        }
      }
    );
    return true;
  }
});
