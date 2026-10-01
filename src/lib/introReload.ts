// A refresh at the homepage's address should stay in the room, but the server can't tell it from a
// fresh arrival (Safari sends nothing that marks a reload), so a refresh there is served the
// underwater intro. The tab remembers instead (his asks, 2026-10-01: links always land on the
// intro; a refresh keeps the visitor where they were):
//  - the homepage notes in this tab's session storage that the tab is in the room, and where it
//    was scrolled to as the page goes (Navigation.tsx);
//  - the intro, opened by a reload while that note is there, goes straight back to the homepage
//    with the guard cookie (middleware.ts) set so the server lets it through, and asks for the
//    place to be restored (the head script in layout.tsx);
//  - anything else that opens the intro clears the note, so the next refresh of the intro stays
//    on it. A link tapped in Instagram, or in any other app, opens a new tab with no note.
// Inline and at the top of the intro's body, so it goes before anything is drawn. The keys and the
// cookie are strings here: keep them in step with Navigation.tsx, layout.tsx and middleware.ts.
export const ROOM_KEY = 'beeds:room'
export const PLACE_KEY = 'beeds:place'

export const introReloadScript =
  "try{var n=performance.getEntriesByType('navigation')[0],p=location.pathname.replace(/\\/$/,'')||'/';" +
  "if(n&&n.type==='reload'&&sessionStorage.getItem('" + ROOM_KEY + "')===p){" +
  "document.cookie='beeds_intro=1;path=/;max-age=10;samesite=lax';" +
  "sessionStorage.setItem('beeds:restore','1');location.replace(location.pathname+location.search+location.hash)" +
  "}else{sessionStorage.removeItem('" + ROOM_KEY + "')}}catch(e){}"
