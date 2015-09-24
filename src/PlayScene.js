//游戏层
var PlayLayer = cc.Layer.extend({
	gameLayer:null,
	score:99,
	scoreLabel:0,
	timeout:1,
	timeoutLabel:30,
	GoldSprites:[],
	ctor:function () {
		this._super();
		var size = cc.winSize;
			
		cc.spriteFrameCache.addSpriteFrames(res.gSprites_plist);

		//添加游戏层
		this.gameLayer=new cc.Layer()
		// 添加missions
		var missions = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("missions.png"));
		missions.attr({
			x: size.width / 2,
			y: size.height-94
		});
		this.gameLayer.addChild(missions, 1);


		// 添加life
		var life = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("life.png"));
		life.attr({
			x: 190,
			y: size.height-200
		});
		this.gameLayer.addChild(life, 1);

		// 添加points
		var points = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("points.png"));
		points.attr({
			x: size.width-137,
			y: size.height-200
		});
		this.gameLayer.addChild(points, 1);

		// 添加得分
		this.scoreLabel = new cc.LabelTTF.create("0", "Arial", 38);
		this.scoreLabel.attr({
			x:size.width/2 + 220,
			y:size.height - 205
		});
		this.gameLayer.addChild(this.scoreLabel, 1);

		//添加倒计时
		this.timeoutLabel = cc.LabelTTF.create(this.timeout, "Arial", 38);
		this.timeoutLabel.attr({
			x:size.width/2 - 95,
			y:size.height - 205
		});
		this.gameLayer.addChild(this.timeoutLabel, 1);
		
		this.addChild(this.gameLayer, 1);
		
		//schedule(callback_fn, interval, repeat, delay)
		this.schedule(this.update,0.3,16*1024,1);

		//timer倒计时60
		this.schedule(this.timer,1,this.timeout,1);

		return true;
	},
	
	update : function() {
		this.addGold();
		this.removeGold();
	},
	
	timer : function() {

		if (this.timeout == 0) {
			this.gameOver();
		}else{
			this.timeout -=1;
			this.timeoutLabel.setString("" + this.timeout);			
		}
	},

	//添加金币
	addGold : function() {
		
		var gold = new GoldSprite("#gold_p1_n_s.png");
		var size = cc.winSize;

//		var x = gold.width/2+size.width/2*cc.random0To1();
		var x = (size.width-gold.width)*cc.random0To1();
		gold.attr({
			x: x,
			y:size.height - 20
		});
		
		//gold.retain();

		this.GoldSprites.push(gold);
		gold.index = this.GoldSprites.length;
		
		this.gameLayer.addChild(gold,2);
		
		var dorpAction = cc.MoveTo.create(2, cc.p(gold.x,-30));
		gold.runAction(dorpAction);
	},	
	
	removeGoldByindex : function(dx) {

		if(isNaN(dx)||dx>this.GoldSprites.length){return false;}  
		for(var i=0,n=0;i<this.length;i++)  
		{  
			if(this.GoldSprites[i]!=this[dx])  
			{  
				this.GoldSprites[n++]=this.GoldSprites[i]  
			}  
		}  
		this.GoldSprites.length-=1 
	},
	
	removeGold : function() {
		
		//移除到屏幕底部的金币
		for (var i = 0; i < this.GoldSprites.length; i++) {
			if(this.GoldSprites[i].y<=-30) {
				this.GoldSprites[i].removeFromParent();
				this.GoldSprites[i] = undefined;
				this.GoldSprites.splice(i,1);
				i= i-1;
			}
		}
	},
	
	addScore:function(){
		this.score +=1;
		this.scoreLabel.setString(this.score);
	},

	gameOver:function(){
		//游戏结束,添加遮罩
		var size = cc.winSize;
		
		this.removeChild(this.gameLayer);
		
		var GameOverLayer = new cc.Layer();
		GameOverLayer.attr({
			x: 0,
			y: 0,
			scale:0.1			
		});
		
		//GameOverLayer第一页(当前成绩页)
		//////////////////////////////////////////////
		//添加submitStar
		var gSingleScorePanel = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("submitStar.png"));
		gSingleScorePanel.attr({
			x: size.width/2,
			y: size.height-381
		});
		GameOverLayer.addChild(gSingleScorePanel, 1);
		
		// 添加得分
		var gSingleScoreLabel = new cc.LabelTTF.create(this.score, "Arial", 72);
		gSingleScoreLabel.attr({
			x:size.width/2,
			y:size.height/2+150
		});
		GameOverLayer.addChild(gSingleScoreLabel, 1);
		
		// 添加累计成绩
		var gSingleLabel = new cc.LabelTTF.create("太腻害了!抢了"+this.score+"分!", "Microsoft Yahei", 24);
		gSingleLabel.attr({
			x:size.width/2,
			y:size.height/2,
			color:cc.color(58, 35, 10)
		});
		GameOverLayer.addChild(gSingleLabel, 1);

		// 添加submitTxt
		var gSingleTxta = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("submitTxt.png"));
		gSingleTxta.attr({
			x: size.width/2,
			y: size.height/2-150
		});
		GameOverLayer.addChild(gSingleTxta, 1);
		
		// 添加submit
		var submitBtnItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("submitBtn_N.png"),
				cc.spriteFrameCache.getSpriteFrame("submitBtn_S.png"),
				function () {
					//xhr提交成绩
					GameOverLayer.runAction(cc.moveBy(0.1, cc.p(-size.width, 0)));
				}, this);
		submitBtnItem.attr({
			x: size.width/2,
			y: size.height/2-230,
			anchorX: 0.5,
			anchorY: 0.5
		});
		submitBtnMenu = new cc.Menu(submitBtnItem);
		submitBtnMenu.attr({
			x:0,
			y:0	
		});
		GameOverLayer.addChild(submitBtnMenu, 1);
		

		//GameOverLayer第二页(累计成绩页)
		//////////////////////////////////////////////
		// 添加gameOverPanel
		var gScoreTotalPanel = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("gameOverPanel.png"));
		gScoreTotalPanel.attr({
			x: size.width/2+size.width,
			y: size.height-381
		});
		GameOverLayer.addChild(gScoreTotalPanel, 1);

		// 添加得分
		var gScoreTotalLabel = new cc.LabelTTF.create(this.score, "Arial", 72);
		gScoreTotalLabel.attr({
			x:size.width/2+size.width,
			y:size.height/2+230
		});
		GameOverLayer.addChild(gScoreTotalLabel, 1);

		// 添加累计成绩
		var gTotalLabel = new cc.LabelTTF.create("累计成绩"+this.score+"分", "Microsoft Yahei", 24);
		gTotalLabel.attr({
			x:size.width/2-150+size.width,
			y:size.height/2+50,
			color:cc.color(58, 35, 10)
		});
		GameOverLayer.addChild(gTotalLabel, 1);

		// 添加奖励信息
		var gPrizeLabel = new cc.LabelTTF.create("前5名接力抢到1000分的用户就能赢得", "Microsoft Yahei", 24);
		gPrizeLabel.attr({
			x:size.width/2-20+size.width,
			y:size.height/2-10,
			color:cc.color(58, 35, 10)
		});
		GameOverLayer.addChild(gPrizeLabel, 1);

		// 添加ticket
		var ticketItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("ticket_N.png"),
				cc.spriteFrameCache.getSpriteFrame("ticket_S.png"),
				function () {
					window.open("http://m.baidu.com/");
					cc.log("优惠券....");
//					cc.director.runScene(cc.TransitionFade.create(0.3,new TicketScene()),false);
				}, this);
		ticketItem.attr({
			x: size.width/2+size.width,
			y: size.height/2-80,
			anchorX: 0.5,
			anchorY: 0.5
		});
		ticketMenu = new cc.Menu(ticketItem);
		ticketMenu.attr({
			x:0,
			y:0	
		});
		GameOverLayer.addChild(ticketMenu, 1);

		// 添加rank
		var rankItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("rank_N.png"),
				cc.spriteFrameCache.getSpriteFrame("rank_S.png"),
				function () {
					GameOverLayer.runAction(cc.moveBy(0.1, cc.p(-size.width, 0)));
					
					//获取排行榜数据
					var rankData;
					cc.loader.loadJson("src/rankData.json",function(error,data){
						cc.log(data);
						if(error) cc.log(error);
						if(data&&data.resultCode===1){
							addRankList(data);
						}
					})					
				}, this);
		rankItem.attr({
			x: size.width/2 + 120+size.width,
			y: size.height/2+50,
			anchorX: 0.5,
			anchorY: 0.5
		});
		rankMenu = new cc.Menu(rankItem);
		rankMenu.attr({
			x:0,
			y:0	
		});
		GameOverLayer.addChild(rankMenu, 1);

		// 添加help
		var helpItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("help_N.png"),
				cc.spriteFrameCache.getSpriteFrame("help_S.png"),
				function () {
					cc.log("Help....");
					cc.director.runScene(new StartScene());
				}, this);
		helpItem.attr({
			x: size.width/2+size.width,
			y: 230,
			anchorX: 0.5,
			anchorY: 0.5
		});
		helpMenu = new cc.Menu(helpItem);
		helpMenu.attr({
			x:0,
			y:0	
		});
		GameOverLayer.addChild(helpMenu, 1);

		// 添加gameOverTxta
		var gameOverTxta = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("gameOverTxta.png"));
		gameOverTxta.attr({
			x: size.width/2+size.width,
			y: 320
		});
		GameOverLayer.addChild(gameOverTxta, 1);

		// 添加gameOverTxtb
		var gameOverTxtb = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("gameOverTxtb.png"));
		gameOverTxtb.attr({
			x: size.width/2+size.width,
			y: 160
		});
		GameOverLayer.addChild(gameOverTxtb, 1);


		//GameOverLayer第三页(排行榜)
		//////////////////////////////////////////////
		//添加排行榜
		var gameRank = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("rank.png"));
		gameRank.attr({
			x: size.width/2+2*size.width,
			y: size.height/2
		});
		GameOverLayer.addChild(gameRank, 1);
		
		//添加排行榜关闭按钮
		var rankCloseItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("rankClose_N.png"),
				cc.spriteFrameCache.getSpriteFrame("rankClose_S.png"),
				function () {
					GameOverLayer.runAction(cc.moveBy(0.1, cc.p(size.width, 0)));
				}, this);
		rankCloseItem.attr({
			x: size.width/2+250+2*size.width,
			y: size.height/2+430,
			anchorX: 0.5,
			anchorY: 0.5
		});
		rankCloseMenu = new cc.Menu(rankCloseItem);
		rankCloseMenu.attr({
			x:0,
			y:0	
		});
		GameOverLayer.addChild(rankCloseMenu, 1);
		
		//添加排行列表
		function addRankList(o){
			// 添加你的排名
			var gMyRankLabel = new cc.LabelTTF.create("你的排名"+o.myRank+"分", "Microsoft Yahei", 24);
			gMyRankLabel.attr({
				x:size.width/2+2*size.width,
				y:size.height/2+300,
				color:cc.color(218, 47, 37)
			});
			GameOverLayer.addChild(gMyRankLabel, 1);
			
			//排行榜列表
			
			
//			if(data.resultCode===1){
//				for(var i=0,len=data.legth;i<len;i++){
//					
//				}
//			}else{
//				cc.log("数据获取异常...");
//			}
		}
		

		this.getParent().addChild(GameOverLayer);		
		GameOverLayer.runAction(cc.scaleTo(0.1, 1));		
		
		this.unschedule(this.update);
		this.unschedule(this.timer);
		
		return true;
	}
		
});

var PlayScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var bglayer = new BgLayer();
		var playLayer = new PlayLayer();
		this.addChild(bglayer);
		this.addChild(playLayer);
	}
});