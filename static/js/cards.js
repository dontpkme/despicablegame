var cards = [{
	type: "attack",
	name: "格魯飛彈",
	desc: "<span class='range'>【遠程】</span>超級壞蛋必備帥氣裝備。80%命中率。",
	image: "missle.png",
	possibility: 100,
	action: []
}, {
	type: "attack",
	name: "冰凍光線槍",
	desc: "<span class='range'>【遠程】</span>格魯的招牌武器，瞬間把人凍成冰塊。50%命中率，讓對手下回合行動失敗。",
	image: "freezeray.png",
	possibility: 80,
	action: []
}, {
	type: "attack",
	name: "火焰噴射槍",
	desc: "<span class='range'>【遠程】</span>露西的武器之一，與格魯的冰凍光線槍不相上下。75%命中率，對手下回合無法防禦。",
	image: "flamethrower.png",
	possibility: 80,
	action: []
}, {
	type: "attack",
	name: "餅乾機器人",
	desc: "<span class='range'>【遠程】</span>看起來好吃但實際上很邪惡的武器。50%命中率，可奪對方一張牌。",
	image: "cookierobot.png",
	possibility: 70,
	action: [{
		take: 1
	}]
}, {
	type: "attack",
	name: "雷射槍",
	desc: "<span class='range'>【遠程】</span>致命的雷射。75%命中率，可棄對手一張牌。",
	image: "laser.png",
	possibility: 70,
	action: [{
		drop: 1
	}]
}, {
	type: "attack",
	name: "超大火球槍",
	desc: "<span class='range'>【近程】</span>一發可以把Space Killer轟出一個大洞。此攻擊無法被防禦，並棄對手兩張牌。",
	image: "bigblastergun.png",
	possibility: 20,
	action: [{
		drop: 2
	}]
}, {
	type: "attack",
	name: "SR-6縮小光線",
	desc: "<span class='range'>【近程】</span>可以縮小任何東西甚至是月球，但要小心反作用力。對手下回合無法攻擊。",
	image: "sr6.png",
	possibility: 80,
	action: []
}, {
	type: "attack",
	name: "伸縮裝－手",
	desc: "<span class='range'>【近程】</span>赫伯的發明物，由蘿蔔使用。可把對手任意移動一步。",
	image: "strechsuithand.png",
	possibility: 40,
	action: []
}, {
	type: "attack",
	name: "電擊口紅",
	desc: "<span class='range'>【近程】</span>露西的隨身武器之一。對手下回合無法移動。",
	image: "lipsticktaser.png",
	possibility: 80,
	action: []
}, {
	type: "attack",
	name: "放屁槍",
	desc: "<span class='range'>【近程】</span>除了噁心臭屁以外，也曾經為了歡送尼法里奥博士用來行過鳴槍禮。可把對手往下拉一步。",
	image: "fartblaster.png",
	possibility: 40,
	action: []
}, {
	type: "attack",
	name: "催眠帽",
	desc: "<span class='range'>【近程】</span>赫伯的發明物，由史都華使用。若對手所站的小小兵不是眼睛睜大的，下兩回合行動失敗。",
	image: "hypnohat.png",
	possibility: 40,
	action: []
}, {
	type: "attack",
	name: "岩漿槍",
	desc: "<span class='range'>【近程】</span>赫伯的發明物，由凱文使用。可棄對手兩張牌。",
	image: "lavalampgun.png",
	possibility: 40,
	action: [{
		drop: 2
	}]
}, {
	type: "attack",
	name: "麻醉手錶",
	desc: "<span class='range'>【近程】</span>露西的隨身武器之一。對手下兩回合50%機率行動失敗。",
	image: "watch.png",
	possibility: 50,
	action: []
}, {
	type: "attack",
	name: "果凍槍",
	desc: "<span class='range'>【近程】</span>發射的果凍能還原PX-41的藥效。可多抽一張牌。與PX-41對打時判定為勝方。",
	image: "jellygun.png",
	possibility: 70,
	action: [{
		draw: 1
	}]
}, {
	type: "attack",
	name: "食人魚發射槍",
	desc: "<span class='range'>【近程】</span>維克特的武器之一，發射出會咬人的食人魚。可奪對手一張牌。",
	image: "fish.png",
	possibility: 70,
	action: [{
		take: 1
	}]
}, {
	type: "shield",
	name: "雨傘",
	desc: "在傘下安全的庇護。防禦攻擊。",
	image: "umbrella.png",
	possibility: 100,
	action: []
}, {
	type: "shield",
	name: "石中劍",
	desc: "拔出石中劍的人就能成為國王，大家都要聽從他。防禦攻擊成功後，可奪對方一張牌。",
	image: "excalibur.png",
	possibility: 70,
	action: [{
		take: 1
	}]
}, {
	type: "shield",
	name: "騎士盔甲",
	desc: "化妝舞會上最帥氣的裝扮，我的馬呢？防禦攻擊成功後，反彈攻擊效果。",
	image: "knight.png",
	possibility: 50,
	action: []
}, {
	type: "shield",
	name: "拳擊比賽",
	desc: "用勾拳或姆指摔角一決勝負？防禦攻擊成功後，下回合對手75%機率行動失敗。",
	image: "boxing.png",
	possibility: 70,
	action: []
}, {
	type: "shield",
	name: "伸縮裝－腳",
	desc: "赫伯的發明物，由蘿蔔使用。80%閃避攻擊。",
	image: "strechsuitleg.png",
	possibility: 100,
	action: []
}, {
	type: "shield",
	name: "PX-41",
	desc: "想來點真正邪惡的東西嗎？連續防禦攻擊兩回合，下回合自己25%機率行動失敗。",
	image: "px41.png",
	possibility: 70,
	action: []
}, {
	type: "shield",
	name: "紫色偽裝",
	desc: "想要看起來更邪惡的東西嗎？塗成紫色吧。連續兩回合50%機率防禦攻擊。",
	image: "purple.png",
	possibility: 70,
	action: []
}, {
	type: "shield",
	name: "惡犬凱爾",
	desc: "不知道是狗或是變種生物，總之會咬人。防禦攻擊成功後，連續兩回合讓對手攻擊成功率降低一半。",
	image: "kyle.png",
	possibility: 50,
	action: []
}, {
	type: "shield",
	name: "噴射背包",
	desc: "飛行是更快的移動方式。50%機率閃避攻擊，若沒被攻擊到可多用一張移動牌。",
	image: "jetpack.png",
	possibility: 50,
	action: [{
		additionalPlay: 1,
		type: "move"
	}]
}, {
	type: "shield",
	name: "烏賊發射槍",
	desc: "維克特的武器之一，發射出噁心的烏賊。50%機率防禦攻擊，若沒被攻擊到可奪對手一張牌。",
	image: "squidlauncher.png",
	possibility: 50,
	action: [{
		take: 1
	}]
}, {
	type: "shield",
	name: "巨大化裝置",
	desc: "赫伯的邪惡機器，讓凱文變得無比巨大。防禦攻擊，並可阻擋任何移動。",
	image: "bigmachine.png",
	possibility: 10,
	action: []
}, {
	type: "move",
	name: "單眼的",
	desc: "一隻大眼睛最可愛。無特殊效果。",
	image: "singleeye.png",
	possibility: 100,
	action: []
}, {
	type: "move",
	name: "雙眼的",
	desc: "兩隻眼睛才能看3D電影。無特殊效果。",
	image: "doubleeye.png",
	possibility: 100,
	action: []
}, {
	type: "move",
	name: "眼睛睜大的",
	desc: "發生了什麼有趣的事情嗎？無特殊效果。",
	image: "eyeopened.png",
	possibility: 100,
	action: []
}, {
	type: "move",
	name: "眼睛半開的",
	desc: "生氣、無聊、無奈、愛睏都是一樣的眼神。無特殊效果。",
	image: "eyehalfopened.png",
	possibility: 100,
	action: []
}, {
	type: "move",
	name: "中分的",
	desc: "中分才是帥氣的王道。60%機率可再抽一張牌。",
	image: "sleek.png",
	possibility: 90,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "軟髮的",
	desc: "看我柔順的頭髮。40%機率可再抽一張牌。",
	image: "soft.png",
	possibility: 90,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "刺髮的",
	desc: "刺刺的髮型看起來有點壞壞的 。70%機率可再抽一張牌。",
	image: "hard.png",
	possibility: 90,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "光頭的",
	desc: "不是禿頭，是光頭。40%機率可再抽一張牌。",
	image: "bold.png",
	possibility: 90,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "高的",
	desc: "資料顯示最高的小小兵是120公分的Tim。50%機率可再抽一張牌。",
	image: "tall.png",
	possibility: 80,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "矮胖的",
	desc: "我不是胖，我是衣服寬鬆了點。這回合附帶50%機率防禦攻擊效果。",
	image: "fat.png",
	possibility: 80,
	action: []
}, {
	type: "move",
	name: "往上看的",
	desc: "因為身高太矮，視線常常往上看。50%機率可再抽一張牌。",
	image: "lookup.png",
	possibility: 80,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "往下看的",
	desc: "因為身高太矮，視線很少有機會往下看。50%機率可棄對方一張牌。",
	image: "lookdown.png",
	possibility: 80,
	action: [{
		drop: 1
	}]
}, {
	type: "move",
	name: "石器時代的",
	desc: "石器時代就有小小兵的足跡，他們的故事被記錄在某個壁畫上。這回合附帶防禦攻擊效果。",
	image: "stoneage.png",
	possibility: 40,
	action: []
}, {
	type: "move",
	name: "蘿蔔國王",
	desc: "蘿蔔因為拔出石中劍當上了國王。這回合附帶防禦攻擊效果，並可多使用一張攻擊牌。",
	image: "bob.png",
	possibility: 30,
	action: [{
		additionalPlay: 1,
		type: "attack"
	}]
}, {
	type: "move",
	name: "嚕嚕咪",
	desc: "來自姆明谷客串登場的嚕嚕咪。這回合附帶防禦攻擊效果，並可奪對方一張牌。",
	image: "moomin.png",
	possibility: 30,
	action: [{
		take: 1
	}]
}, {
	type: "move",
	name: "拿食物的",
	desc: "追逐食物的小小兵是無敵的。這回合附帶防禦攻擊效果。",
	image: "food.png",
	possibility: 50,
	action: []
}, {
	type: "move",
	name: "拿武器的",
	desc: "小小兵拿武器的時候是很危險的。可多用一張攻擊牌。",
	image: "armed.png",
	possibility: 50,
	action: [{
		additionalPlay: 1,
		type: "attack"
	}]
}, {
	type: "move",
	name: "拿花的",
	desc: "花是很棒的生日禮物。可多用一張移動牌。",
	image: "rose.png",
	possibility: 50,
	action: [{
		additionalPlay: 1,
		type: "move"
	}]
}, {
	type: "move",
	name: "拿禮物的",
	desc: "最棒的生日禮物送給最棒的嚕。可再抽兩張牌。",
	image: "gift.png",
	possibility: 50,
	action: [{
		draw: 2
	}]
}, {
	type: "move",
	name: "海盜的",
	desc: "Aye aye sir！我是快樂的黃色海盜。可奪對方一張牌。",
	image: "pirate.png",
	possibility: 40,
	action: [{
		take: 1
	}]
}, {
	type: "move",
	name: "拿破崙的",
	desc: "歷史上拿破崙因為小小兵的幫助慘遭滑鐵盧。可奪對方一張牌。",
	image: "napeleon.png",
	possibility: 40,
	action: [{
		take: 1
	}]
}, {
	type: "move",
	name: "特務的",
	desc: "身手不凡的特務。可棄對手一張牌。",
	image: "agent.png",
	possibility: 40,
	action: [{
		drop: 1
	}]
}, {
	type: "move",
	name: "嚕嚕咪帽的",
	desc: "只有這裡有戴著限量版嚕嚕咪帽子的小小兵。可再抽兩張牌。",
	image: "cap.png",
	possibility: 30,
	action: [{
		draw: 2
	}]
}, {
	type: "move",
	name: "戴帽子的",
	desc: "在不同場合戴不同的帽子，頭巾也可以算帽子吧？可再抽一張牌。",
	image: "hat.png",
	possibility: 40,
	action: [{
		draw: 1
	}]
}, {
	type: "move",
	name: "史都華",
	desc: "彈著烏克麗麗的規則破壞者。可棄對方兩張牌。",
	image: "stuart.png",
	possibility: 30,
	action: [{
		drop: 2
	}]
}, {
	type: "move",
	name: "凱文",
	desc: "有責任感的凱文，為了同伴們挺身出發去冒險。可任意多移動一步不需消耗移動牌。",
	image: "kevin.png",
	possibility: 30,
	action: []
}, {
	type: "move",
	name: "拖曳飛行",
	desc: "小小兵也能飛，飛行時要小心經過的鳥。只有在落後時才可使用，若未被攻擊，可任意移動兩步。",
	image: "fly.png",
	possibility: 40,
	action: []
}, {
	type: "move",
	name: "噴射機",
	desc: "飛機是所有交通工具中最安全快速的一種。此移動能無視任何攻擊。",
	image: "aircraft.png",
	possibility: 20,
	action: []
}];