export function load({cookies}) {
    if(cookies.get("username") && cookies.get("gh_token"))
        return {logged_in: true};
    else
        return {logged_in: false};
}