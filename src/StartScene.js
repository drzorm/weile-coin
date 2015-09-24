//背景层
var BgLayer=cc.Layer.extend({
	ctor:function () {
		
		this._super();
		var size = cc.winSize;
		
		// 添加背景
		var bgSprite = new cc.Sprite(res.BackGround_jpg);
		bgSprite.attr({
			x: size.width / 2,
			y: size.height / 2
		});
		this.addChild(bgSprite, 0);
		
//		// 添加missions
//		var missions = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("missions.png"));
//		missions.attr({
//			x: size.width / 2,
//			y: size.height-94
//		});
//		this.addChild(missions, 1);
//
//
//		// 添加life
//		var life = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("life.png"));
//		life.attr({
//			x: 190,
//			y: size.height-200
//		});
//		this.addChild(life, 1);
//
//		// 添加points
//		var points = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("points.png"));
//		points.attr({
//			x: size.width-137,
//			y: size.height-200
//		});
//		this.addChild(points, 1);
	}
});

//开始层
var StartLayer = cc.Layer.extend({
	ctor:function () {
		
		this._super();
		var size = cc.winSize;
		
		// 添加背景遮罩
		var bgShade = new cc.LayerColor.create(cc.color(0,0,0,178),1280,1138);
		bgShade.attr({
			x: 0,
			y: 0
		});
		this.addChild(bgShade,1);
		
		// 添加gameRule
		var gameRule = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("gameRule.png"));
		gameRule.attr({
			x: size.width/2,
			y: size.height/2
		});
		this.addChild(gameRule, 1);
		

		// 添加开始按钮
		var startItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("start_N.png"),
				cc.spriteFrameCache.getSpriteFrame("start_S.png"),
				function () {
					//cc.director.runScene(cc.TransitionFade.create(1,new PlayScene()),false);
					cc.director.runScene(new PlayScene());
				}, this);
		startItem.attr({
			x: size.width/2-110,
			y: size.height/2-120,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.startMenu = new cc.Menu(startItem);
		this.startMenu.attr({
			x:0,
			y:0	
		});
		this.addChild(this.startMenu, 1);

		//添加退出按钮
		var exitItem = new cc.MenuItemImage.create(
				cc.spriteFrameCache.getSpriteFrame("exit_N.png"),
				cc.spriteFrameCache.getSpriteFrame("exit_S.png"),
				function () {
					cc.log("关闭游戏...");
				}, this);
		exitItem.attr({
			x: size.width/2+110,
			y: size.height/2-120,
			anchorX: 0.5,
			anchorY: 0.5
		});
		var exitMenu = new cc.Menu(exitItem);
		exitMenu.attr({
			x:0,
			y:0	
		});
		this.addChild(exitMenu, 1);

		//添加活动详情按钮
		var activityRuleItem = new cc.MenuItemImage(
			cc.spriteFrameCache.getSpriteFrame("activityRule_N.png"),
			cc.spriteFrameCache.getSpriteFrame("activityRule_S.png"),
			function () {
				this.runAction(cc.moveBy(0.1, cc.p(-size.width, 0)));
//				cc.director.runScene(cc.TransitionFade.create(0.3,new RuleScene()),false);
			}, this);
		activityRuleItem.attr({
			x: size.width/2,
			y: size.height/2-300,
			anchorX: 0.5,
			anchorY: 0.5
		});
		var activityRuleMenu = new cc.Menu(activityRuleItem);
		activityRuleMenu.attr({
			x:0,
			y:0	
		});
		this.addChild(activityRuleMenu, 1);
		
		
		
		// 添加活动规则详情
		var activityRuleDetial = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("activityRuleDetial.png"));
		activityRuleDetial.attr({
			x: size.width/2+size.width,
			y: size.height/2
		});
		this.addChild(activityRuleDetial, 1);
		

		// 添加活动详情返回按钮
		var ruleReturnItem = new cc.MenuItemImage(
				cc.spriteFrameCache.getSpriteFrame("ruleReturn_N.png"),
				cc.spriteFrameCache.getSpriteFrame("ruleReturn_S.png"),
				function () {
//					this.activityRuleDetial.runAction(cc.scaleTo(0.1,2, 2));
					this.runAction(cc.moveBy(0.1, cc.p(size.width, 0)));
//					this.activityRuleDetial.runAction(cc.sequence(
//					    cc.moveBy(1, cc.p(150, 0)),
//					    cc.callFunc(this.onBugMe, this))
//					);
				}, this);
		ruleReturnItem.attr({
			x: size.width/2+size.width,
			y: size.height/2-250,
			anchorX: 0.5,
			anchorY: 0.5
		});
		ruleReturnMenu = new cc.Menu(ruleReturnItem);
		ruleReturnMenu.attr({
			x:0,
			y:0	
		});
		this.addChild(ruleReturnMenu, 1);
		
		
		return true;
	}
});


var StartScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		
		cc.spriteFrameCache.addSpriteFrames(res.gSprites_plist);
		var bgLayer = new BgLayer();
		var startLayer = new StartLayer();
		this.addChild(bgLayer);
		this.addChild(startLayer);
	}
});