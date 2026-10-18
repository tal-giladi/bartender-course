/* The seven guest scenarios (lessons 09.2–09.7, 11.5). Each: 4 decision points × 3 choices scored 2 / 1 / 0;
   some 0-choices are safety-critical (`safety` = the failure as written in the score report).
   Legal references as checked in Module 9 on 2026-10-18. All guests are fictional.
   Classic script: window.GUEST_SCENARIOS; module.exports under Node. */
(function (root) {
  "use strict";
  var SCENARIOS = [
    {
      id: "underage", title: "Possible minor", lesson: "09.5",
      card: "It is 22:00 on a Thursday. Two young men come to the bar. One looks about 17 and orders two beers. His friend says, \"He's with me, he's 19.\"",
      rule: "No sale or serving of alcohol to anyone under 18; if a minor was served, the seller is presumed to have known unless the minor showed an ID saying they were adult (Penal Law s. 193A, statutory). Bars' licence condition: anyone who wants to drink shows ID.",
      steps: [
        { prompt: "\"Two beers, please.\" The friend adds: \"He's with me, he's 19.\" The bar is busy.",
          why: "Ask everyone who wants to drink for ID, politely and the same way for all. A friend's word is not an ID, and the law presumes you knew the guest's age unless you saw an ID.",
          choices: [
            { text: "Smile: \"Hi guys! Can I see ID from both of you, please?\"", points: 2, reaction: "The friend reaches for his wallet. The young one hesitates and takes out his phone." },
            { text: "Ask only the young-looking one, with a joke: \"You look about twelve, mate. ID?\"", points: 1, reaction: "He goes red and his friend rolls his eyes, but he takes out his phone." },
            { text: "Pour the two beers: the friend says he is 19 and there is a queue.", points: 0, safety: "Served a possible minor without an ID check.", reaction: "You put two beers on the bar. The young one takes one." }
          ] },
        { prompt: "The young man shows a photo of an ID card on his phone: \"My card is at home. Look, it says I'm 19.\"",
          why: "A photo on a phone is not an identity document and can be anyone's or edited. Without a physical ID showing 18+, no alcohol; say why and offer a real alternative.",
          choices: [
            { text: "\"Sorry, I need to see the actual card. Without it I can't serve alcohol; it's the law. I can make you something without alcohol: a lemonade with mint, or a ginger beer?\"", points: 2, reaction: "He sighs. \"Fine, a ginger beer then.\"" },
            { text: "\"No card, no beer,\" and turn to the next guest.", points: 1, reaction: "He looks annoyed and stands at the bar with nothing." },
            { text: "Accept the photo: the date of birth on it shows he is 19.", points: 0, safety: "Served alcohol without seeing a physical ID showing 18+.", reaction: "You hand him the beer. Nobody can prove the photo is his." }
          ] },
        { prompt: "The friend shows his own valid ID card: he is 22. \"OK, then just give me both beers. I'll drink them both.\"",
          why: "An adult with a valid ID may buy his own drink. Two beers for one person, right after his young friend was refused, is a classic pass-on: serve him one, for him.",
          choices: [
            { text: "Serve the friend one beer, for himself, and keep an eye on the pair.", points: 2, reaction: "\"One beer, for you,\" you say. He shrugs and pays." },
            { text: "Refuse the friend too, because his companion has no ID.", points: 1, reaction: "\"Seriously? I'm 22!\" He is annoyed; your manager may back you, but you lost a guest you could have served." },
            { text: "Serve both beers to the friend: he showed a valid ID.", points: 0, safety: "Served the friend's second beer, which goes to the young guest.", reaction: "Two beers go on the bar. One is pushed across to the young man a minute later." }
          ] },
        { prompt: "Ten minutes later you see the friend slide his beer across to the young man, who starts drinking it.",
          why: "Alcohol your bar served ending up with a possible minor is still your problem. Act at once, politely and privately, involve the manager and log it.",
          choices: [
            { text: "Go over, politely take the beer back, explain you can't allow it, tell the manager and log it.", points: 2, reaction: "\"Sorry guys, I can't let that happen; I'll get you a soft drink instead.\" The manager nods from the door." },
            { text: "Take the beer and tell the friend loudly, in front of the bar, that he could get the place closed.", points: 1, reaction: "You took the beer, but the whole bar turns to stare and the pair walk out angry." },
            { text: "Leave it: you served the beer to an adult with ID, the rest is not your business.", points: 0, safety: "Let a possible minor drink alcohol served at the bar.", reaction: "The young man finishes the beer at your bar." }
          ] }
      ]
    },
    {
      id: "intoxicated", title: "Intoxicated guest", lesson: "09.4",
      card: "01:00. Avi, a regular who has been at the bar since 21:00, slurs as he orders \"one more round, and shots for everyone\". He sways and holds the bar. His car keys are on the bar.",
      rule: "No supply of alcohol to a drunk person, or encouraging them to drink, by the owner or a worker of an alcohol-selling business (Penal Law s. 193(c), statutory). Signs and management steps: official guidance (NSW), alcohol poisoning: NHS.",
      steps: [
        { prompt: "Avi, slurring and swaying: \"One more round, and shots for everyone!\"",
          why: "Slurred speech and swaying are clear signs: no more alcohol for him. Tell the manager first, then speak to him privately and calmly so he keeps his dignity.",
          choices: [
            { text: "Tell the manager quietly, then ask Avi to step to the end of the bar to talk privately.", points: 2, reaction: "The manager nods. Avi follows you to the quiet end, still holding the bar." },
            { text: "Announce across the bar: \"Avi, you're drunk. You're done for tonight!\"", points: 1, reaction: "The bar goes quiet. Avi is embarrassed and gets louder." },
            { text: "Pour the round for the table, including a beer for Avi, but no shot for him.", points: 0, safety: "Served alcohol to a clearly intoxicated guest.", reaction: "Avi lifts his beer and toasts the table." }
          ] },
        { prompt: "Avi, at the end of the bar: \"Come on, just a small one. A light beer. I'm fine, I've been coming here for years.\"",
          why: "\"A small one\" or a low-alcohol beer is still alcohol. Refuse clearly, give the reason (law and policy, his safety), and end with an offer.",
          choices: [
            { text: "\"Avi, I can't pour you any more alcohol tonight. It's the law and our policy, and I want you to get home safe. Let me get you water and something to eat.\"", points: 2, reaction: "He grumbles, then sits down. \"Water. And the fries.\"" },
            { text: "\"Sorry, rules are rules,\" and walk away to the next order.", points: 1, reaction: "He is left standing alone at the bar, irritated." },
            { text: "Give him a light beer as a compromise, so he stays calm.", points: 0, safety: "Served alcohol to a clearly intoxicated guest.", reaction: "Avi drinks the beer quickly and asks for another." }
          ] },
        { prompt: "Avi picks up his car keys: \"Fine. I'm going home then.\"",
          why: "Never let an intoxicated guest drive. Offer a taxi now, tell the manager; if he insists on driving, the manager decides on calling the police (100). Do not grab keys yourself.",
          choices: [
            { text: "\"Leave the car tonight; I'll call you a taxi now.\" Tell the manager; if he insists on driving, the manager decides on calling the police.", points: 2, reaction: "Avi hesitates, then puts the keys in his pocket. \"OK, a taxi.\" You call one." },
            { text: "Ask his friends at the table to make sure he gets home, and go back to work.", points: 1, reaction: "A friend says \"sure\", but nobody mentions the car." },
            { text: "Wish him a good night as he heads to his car.", points: 0, safety: "Let an intoxicated guest drive.", reaction: "Avi walks out to the car park with his keys." }
          ] },
        { prompt: "While he waits for the taxi, Avi goes pale, vomits and becomes very drowsy.",
          why: "Possible alcohol poisoning: call 101, stay with him, keep him sitting up or in the recovery position if he passes out, check his breathing, tell the manager. No coffee, food or cold shower.",
          choices: [
            { text: "Stay with him, call 101, tell the manager; keep him sitting up and in the recovery position if he passes out; no coffee or cold water.", points: 2, reaction: "The paramedics arrive within minutes. Your manager writes it in the incident log with you." },
            { text: "Sit him down with water and ask a friend to keep an eye on him; check back in a few minutes.", points: 1, reaction: "His friend sits with him, but nobody has called for help yet." },
            { text: "Help him outside for some air and leave him on the bench to wait for the taxi.", points: 0, safety: "Left an unwell intoxicated guest alone.", reaction: "Avi is alone on the bench, barely awake." }
          ] }
      ]
    },
    {
      id: "unclear", title: "Unclear order", lesson: "09.2",
      card: "A guest says: \"A Martini, not too strong, sweet but dry, vodka or whatever.\"",
      rule: "Clarification method: repeat, name the conflict, offer two options, check back (professional judgment).",
      steps: [
        { prompt: "\"A Martini, not too strong, sweet but dry, vodka or whatever.\"",
          why: "Repeat what you heard and name the conflict in plain words: in a Martini \"dry\" means less vermouth and more spirit, which makes it stronger, the opposite of \"not too strong\".",
          choices: [
            { text: "\"A Martini can go a couple of ways. Dry means less vermouth and more spirit, which makes it stronger. Can I offer you two options?\"", points: 2, reaction: "\"Oh! I didn't know that. I just like something smooth.\"" },
            { text: "\"What do you mean exactly?\"", points: 1, reaction: "\"Er… a Martini? Not too strong?\" The guest is no clearer than before." },
            { text: "Make the house Dry Martini with gin: that is what \"a Martini\" means.", points: 0, reaction: "You serve 60 ml gin and 10 ml vermouth. The guest winces at the first sip." }
          ] },
        { prompt: "\"I just like something smooth, not too boozy. Vodka's fine.\"",
          why: "Two clear options a guest can choose between beat a long list. Describe each in words the guest used: softer, sweeter, lighter.",
          choices: [
            { text: "\"Would you like a softer vodka Martini with more vermouth, a bit sweeter and lighter, or something fruity and sweet like a French Martini?\"", points: 2, reaction: "\"The softer vodka one sounds perfect.\"" },
            { text: "Read out the ten cocktails on the menu so the guest can pick.", points: 1, reaction: "The guest looks lost halfway through the list." },
            { text: "\"Then a Martini isn't really for you.\"", points: 0, reaction: "The guest looks embarrassed. \"Just a beer then.\"" }
          ] },
        { prompt: "The guest chooses the softer vodka Martini.",
          why: "Check back the exact drink before you make it: name, spirit, the change and the service. It catches mistakes before they cost a remake.",
          choices: [
            { text: "\"One softer vodka Martini with extra vermouth, stirred and served up. Perfect.\"", points: 2, reaction: "\"Exactly, thanks.\"" },
            { text: "Start making it straight away without saying anything.", points: 1, reaction: "You hope you understood. The guest watches, unsure." },
            { text: "Make it with gin: a real Martini is gin, whatever the guest said.", points: 0, reaction: "The guest frowns at the first sip: \"Is this vodka?\"" }
          ] },
        { prompt: "The drink is ready.",
          why: "Serve with a few words about what it is, then check in after a few sips: the guest feels heard and you can fix it early if needed.",
          choices: [
            { text: "Serve it, say what it is, and check in after a few sips.", points: 2, reaction: "\"Lovely, just what I wanted.\"" },
            { text: "Put it down and move on to the next guest.", points: 1, reaction: "The guest drinks it; you never find out whether they liked it." },
            { text: "Tell the guest the classic Dry Martini is better and they should try it next time.", points: 0, reaction: "The guest feels told off and doesn't order again." }
          ] }
      ]
    },
    {
      id: "allergy", title: "Allergy", lesson: "09.3",
      card: "A guest says, \"I'm allergic to nuts,\" and orders a Mai Tai. You just made a Mai Tai for the previous guest with the same shaker.",
      rule: "Never guess; check the spec and the labels, tell the guest, make it clean (EU 1169/2011 allergen list adopted in Israel; MoH allergen guide 2025; professional standard). In a severe reaction call 101.",
      steps: [
        { prompt: "\"I'm allergic to nuts. Can I have a Mai Tai?\"",
          why: "Stop and ask first: which nuts, and whether a trace matters. Then check. \"Should be fine\" is a guess, and guessing about allergens is a safety failure.",
          choices: [
            { text: "\"Thanks for telling me. Which nuts, and is even a trace a problem?\"", points: 2, reaction: "\"All tree nuts. Even a trace, yes.\"" },
            { text: "\"Let me check the spec,\" without asking anything else.", points: 1, reaction: "You turn to the recipe card; you don't yet know how severe it is." },
            { text: "\"Should be fine, there are no nuts in a Mai Tai.\"", points: 0, safety: "Guessed about an allergen instead of checking.", reaction: "The guest relaxes. You start pouring." }
          ] },
        { prompt: "\"All tree nuts, even a trace. Is the Mai Tai OK?\"",
          why: "The Mai Tai contains orgeat, an almond syrup: tell the guest clearly you cannot make it, and offer drinks whose ingredients you can confirm by their labels.",
          choices: [
            { text: "\"The Mai Tai has orgeat, which is an almond syrup, so I can't make that one for you. I can make you a Daiquiri or a Mojito; the rum and lime are nut-free by their labels.\"", points: 2, reaction: "\"Thank you for checking. A Daiquiri, please.\"" },
            { text: "Offer a Mai Tai without the orgeat, telling her it won't taste the same.", points: 1, reaction: "\"Hmm… OK, or maybe something else?\" A changed spec still leaves the shaker question." },
            { text: "Make the Mai Tai as usual: orgeat is just a syrup.", points: 0, safety: "Served orgeat (almond) to a guest with a nut allergy.", reaction: "You shake a Mai Tai with 15 ml of orgeat for her." }
          ] },
        { prompt: "She orders a Daiquiri. The shaker you used for the last Mai Tai is on the station, wet with orgeat.",
          why: "Prevent cross-contact: wash your hands, use a freshly washed shaker and jigger, fresh ice, and mark the order so the whole team knows.",
          choices: [
            { text: "Wash your hands, take a freshly washed shaker and jigger, fresh ice; mark the ticket \"nut allergy\".", points: 2, reaction: "A clean set, fresh ice, labels checked. The ticket says \"NUT ALLERGY\"." },
            { text: "Use a clean shaker, but don't mark the ticket or tell the runner.", points: 1, reaction: "The drink is clean, but nobody else knows about the allergy." },
            { text: "Shake the Mai Tai shaker out and reuse it: there is only a trace left.", points: 0, safety: "Used an unwashed shaker after orgeat.", reaction: "Traces of almond syrup go into her Daiquiri." }
          ] },
        { prompt: "The Daiquiri is ready.",
          why: "Serve an allergy drink yourself, say what you did, and check in. If a severe reaction ever starts: 101 at once, help with her auto-injector, tell the manager.",
          choices: [
            { text: "Serve it yourself: \"Your Daiquiri, made with a clean set.\" Check in after a few minutes.", points: 2, reaction: "\"Thank you, that's really reassuring.\"" },
            { text: "Send it with the runner along with the other drinks.", points: 1, reaction: "It arrives, but she isn't sure which drink is hers." },
            { text: "Leave it on the bar for her to collect and get back to the queue without a word.", points: 0, reaction: "She has to ask twice whether this is the nut-free one." }
          ] }
      ]
    },
    {
      id: "complaint", title: "Complaint", lesson: "09.2",
      card: "A guest pushes back a Margarita you made to the house spec: \"This is way too sour, I can't drink it.\"",
      rule: "Listen, apologise, solve, thank (professional judgment; many venues teach a version called LAST).",
      steps: [
        { prompt: "\"This is way too sour, I can't drink it.\"",
          why: "Listen to the end without interrupting or defending the spec, then apologise for the experience. Arguing that it was \"correct\" never wins a guest back.",
          choices: [
            { text: "Let her finish, then: \"I'm sorry it's not how you like it.\"", points: 2, reaction: "She softens: \"It's not your fault, I just like them sweeter.\"" },
            { text: "Say \"sorry\" quickly and take the glass before she finishes speaking.", points: 1, reaction: "\"I wasn't done…\" She feels rushed." },
            { text: "\"That's the IBA spec. It's supposed to be sour.\"", points: 0, reaction: "\"Well, I don't like it.\" She pushes it further away." }
          ] },
        { prompt: "She waits to see what you will do.",
          why: "Offer a fix and an alternative and let the guest choose.",
          choices: [
            { text: "\"I can make it a little sweeter, or make you something else, maybe a Paloma?\"", points: 2, reaction: "\"Sweeter would be great.\"" },
            { text: "\"I can make it a bit sweeter for you.\"", points: 1, reaction: "\"OK…\" She takes the only option offered." },
            { text: "\"Everyone else likes it this way.\"", points: 0, reaction: "She stops talking to you and turns to her friend." }
          ] },
        { prompt: "She would like it sweeter.",
          why: "Remake it properly: bin the first drink, remake with about +5 ml syrup in a clean glass, taste with a straw before serving, and log the waste.",
          choices: [
            { text: "Bin it, remake with about 5 ml more syrup in a clean glass, and taste-check with a straw.", points: 2, reaction: "The new one is balanced to her taste." },
            { text: "Add some syrup to her glass and stir it.", points: 1, reaction: "Quicker, but it's the glass she drank from and the drink is now watery." },
            { text: "Make exactly the same drink again and say you made it sweeter.", points: 0, reaction: "She tastes it: \"It's exactly the same.\"" }
          ] },
        { prompt: "The new Margarita is ready.",
          why: "Serve with thanks, check in after a few sips, and write the remake in the waste log.",
          choices: [
            { text: "\"Here you go, a touch sweeter. Thanks for telling me.\" Check in after a few sips; log the waste.", points: 2, reaction: "\"Perfect. Thank you!\" She orders a second one later." },
            { text: "Put it down without a word.", points: 1, reaction: "She drinks it. You never hear whether it's right." },
            { text: "Ring up the remake as a second drink.", points: 0, reaction: "She sees the bill and asks for the manager." }
          ] }
      ]
    },
    {
      id: "strong", title: "Strong drink request", lesson: "09.4",
      card: "A guest who seems sober and has just arrived says: \"Give me the strongest thing you have. Triple everything. I want to feel it fast.\"",
      rule: "House measures for every drink (house policy); never encourage fast or heavy drinking; no alcohol once signs of intoxication appear (Penal Law s. 193(c), statutory).",
      steps: [
        { prompt: "\"Give me the strongest thing you have. Triple everything. I want to feel it fast.\"",
          why: "Before you answer, look: speech, balance, coordination, behaviour. He seems sober, so you can serve him, within house measures.",
          choices: [
            { text: "Greet him and check for signs of intoxication (speech, balance, behaviour): none.", points: 2, reaction: "Clear speech, steady hands. He has just arrived." },
            { text: "Answer at once without really looking at him.", points: 1, reaction: "You have no idea yet whether he has been drinking elsewhere." },
            { text: "Line up three shots of the strongest spirit on the bar.", points: 0, safety: "Poured above the house spec.", reaction: "Three shots in a row, before you've said a word." }
          ] },
        { prompt: "He waits for your answer.",
          why: "Same measure in every drink: no triples. Offer a strong-tasting, spirit-forward classic, and a double only where house policy allows it, charged as a double.",
          choices: [
            { text: "\"We pour the same measure in every drink, so no triples, sorry. If you like strong, a Negroni or a Martini is about as spirit-forward as it gets; I can make it a double, charged as a double.\"", points: 2, reaction: "\"A Negroni then. A double.\"" },
            { text: "\"We don't do strong drinks here.\"", points: 1, reaction: "\"Seriously?\" He looks around for somewhere else." },
            { text: "Make him a Negroni with triple measures, \"just this once\".", points: 0, safety: "Poured above the house spec.", reaction: "A 270 ml Negroni goes on the bar." }
          ] },
        { prompt: "\"Great. And what gets me drunk fastest?\"",
          why: "Never describe a drink as a way to get drunk fast or push shots. Offer water with it and keep an eye on his pace.",
          choices: [
            { text: "\"I'd rather make you something you enjoy slowly. Here's some water with it.\"", points: 2, reaction: "He laughs. \"Fair enough.\" He sips the Negroni." },
            { text: "Laugh it off without answering and serve the drink.", points: 1, reaction: "He drinks quickly. Nobody has said anything about pace." },
            { text: "\"Shots, definitely. Want a round of three?\"", points: 0, safety: "Encouraged fast or heavy drinking.", reaction: "He nods. Three shots go down in a minute." }
          ] },
        { prompt: "Forty minutes and two doubles later he is loud, slurring slightly, knocks over a glass and orders another double.",
          why: "Slurring and clumsiness are signs of intoxication: no more alcohol. Refuse privately with the reason, offer water, food or a soft drink, and tell the manager.",
          choices: [
            { text: "Refuse privately: no more alcohol tonight, law and policy; offer water, food or a soft drink; tell the manager.", points: 2, reaction: "He argues for a moment, then takes the water. Your manager checks on him later." },
            { text: "Quietly give him water instead without telling him why.", points: 1, reaction: "\"This is water. Where's my double?\" He is confused and annoyed." },
            { text: "Serve him a single instead of a double.", points: 0, safety: "Served a guest showing signs of intoxication.", reaction: "He drinks it and orders another." }
          ] }
      ]
    },
    {
      id: "alcohol-free", title: "Alcohol-free request", lesson: "09.7",
      card: "A guest says she is pregnant and is celebrating with friends. She wants \"something festive, without alcohol, that looks like a real cocktail\". Your bar has a 0.5% beer, a 0.0% sparkling wine, Angostura bitters, citrus, syrups and soda.",
      rule: "Ministry of Health: avoid alcohol completely during pregnancy (official guidance). Say the ABV of anything that is not 0.0% (lesson 07.5).",
      steps: [
        { prompt: "\"I'm pregnant and celebrating! Something festive, without alcohol, that looks like a real cocktail?\"",
          why: "Welcome the request warmly and treat it as a real cocktail order. A 0.5% beer is not alcohol-free: never offer it as if it were.",
          choices: [
            { text: "\"Congratulations! I can make you something festive with no alcohol at all. Do you like it fruity, bitter-sweet or herby?\"", points: 2, reaction: "\"Fruity and a bit bitter, like grapefruit!\"" },
            { text: "\"We have juice and soft drinks.\"", points: 1, reaction: "\"Oh… OK.\" She looks disappointed." },
            { text: "\"Try our 0.5% beer, it's basically alcohol-free.\"", points: 0, safety: "Offered a drink with alcohol (0.5% beer) as alcohol-free.", reaction: "\"Basically?\" She isn't sure what you mean." }
          ] },
        { prompt: "\"Grapefruit sounds great. What could you make?\"",
          why: "Two festive 0.0% options. Bitters look harmless but Angostura is about 44.7% ABV: leave them out or say so.",
          choices: [
            { text: "\"A sparkling grapefruit and rosemary highball in a flute, or the 0.0% sparkling wine with a little elderflower syrup?\"", points: 2, reaction: "\"The grapefruit one, in a flute!\"" },
            { text: "\"A Virgin Mojito: that's the alcohol-free one I know.\"", points: 1, reaction: "\"Not really grapefruit, but OK.\"" },
            { text: "\"Grapefruit soda with a few dashes of Angostura for colour,\" without mentioning the bitters' alcohol.", points: 0, safety: "Offered bitters (about 44.7% ABV) without telling her they contain alcohol.", reaction: "\"Sounds pretty!\" She has no idea the bitters are alcoholic." }
          ] },
        { prompt: "She chooses the grapefruit highball. Your usual recipe finishes with two dashes of Angostura.",
          why: "For a pregnant guest, leave the bitters out; get aroma from a grapefruit peel or rosemary instead.",
          choices: [
            { text: "Leave the bitters out; express a grapefruit peel and add a rosemary sprig for aroma.", points: 2, reaction: "It smells wonderful and is 0.0%." },
            { text: "Ask her whether bitters are OK, telling her they contain about 45% alcohol.", points: 1, reaction: "\"Better not.\" Honest, but you put the decision on her; leaving them out was simpler." },
            { text: "Add the two dashes: \"it's just a dash, it's basically nothing\".", points: 0, safety: "Served a drink with alcohol (bitters) without telling her.", reaction: "Two dashes of 44.7% bitters go into her drink." }
          ] },
        { prompt: "Her friend leans over: \"Put a tiny splash of Prosecco in hers, she won't notice, it's a celebration!\"",
          why: "Never add alcohol to a guest's drink behind her back. Decline politely, keep it 0.0%, serve it beautifully and tell her it is completely alcohol-free.",
          choices: [
            { text: "Decline politely, keep it 0.0%, serve it in a flute with the garnish: \"Completely alcohol-free, enjoy!\"", points: 2, reaction: "\"It looks like a real cocktail!\" Her friends take photos." },
            { text: "Ignore the friend and serve the drink in a plain glass with a straw.", points: 1, reaction: "It's alcohol-free, but it doesn't feel festive." },
            { text: "Add a small splash of Prosecco, as the friend asked.", points: 0, safety: "Served a drink with alcohol without telling her.", reaction: "She drinks it thinking it's alcohol-free." }
          ] }
      ]
    }
  ];
  if (typeof module !== "undefined" && module.exports) module.exports = SCENARIOS;
  else root.GUEST_SCENARIOS = SCENARIOS;
})(typeof window !== "undefined" ? window : globalThis);
