import React, { useState, useEffect, useRef } from 'react';
import { Utensils, ChefHat, RefreshCw, Shuffle, Sparkles, MapPin, Flame, ArrowRight } from 'lucide-react';

// --- 数据配置 (基于中国饮食习惯构建) ---
const FOOD_DATA = [
  {
    category: "中式正餐",
    icon: "🥢",
    cuisines: [
      { name: "川湘重口", dishes: ["麻婆豆腐", "水煮鱼", "辣椒炒肉", "毛血旺", "宫保鸡丁", "剁椒鱼头", "回锅肉", "辣子鸡", "酸菜鱼", "泡椒牛蛙", "小炒黄牛肉"] },
      { name: "粤式/茶餐厅", dishes: ["烧鹅/叉烧饭", "干炒牛河", "白切鸡", "煲仔饭", "鲜虾云吞面", "菠萝咕咾肉", "滑蛋虾仁", "烧鸭", "梅菜扣肉", "猪肚鸡"] },
      { name: "江浙/淮扬", dishes: ["红烧狮子头", "西湖醋鱼", "糖醋排骨", "东坡肉", "小笼包", "阳春面", "松鼠桂鱼", "龙井虾仁", "响油鳝糊", "大煮干丝"] },
      { name: "东北/鲁菜", dishes: ["锅包肉", "地三鲜", "猪肉炖粉条", "葱爆羊肉", "木须肉", "饺子", "京酱肉丝", "溜肉段", "小鸡炖蘑菇", "红烧肉"] },
      { name: "家常小炒", dishes: ["西红柿炒蛋", "酸辣土豆丝", "鱼香肉丝", "红烧茄子", "蒜苔炒肉", "青椒肉丝", "干煸四季豆", "番茄牛腩", "蚝油生菜"] }
    ]
  },
  {
    category: "面食/粉粥",
    icon: "🍜",
    cuisines: [
      { name: "北方面食", dishes: ["兰州拉面", "炸酱面", "刀削面", "油泼面", "羊肉泡馍", "肉夹馍+凉皮", "打卤面", "豆角焖面", "疙瘩汤", "烩面"] },
      { name: "南方粉面", dishes: ["重庆小面", "螺蛳粉", "桂林米粉", "过桥米线", "武汉热干面", "沙茶面", "鸭血粉丝汤", "广式肠粉", "酸辣粉", "南昌拌粉"] },
      { name: "粥品/点心", dishes: ["皮蛋瘦肉粥", "生滚牛肉粥", "煎饼果子", "小馄饨", "生煎包", "锅贴", "油条豆浆", "豆腐脑", "胡辣汤", "葱油饼", "小米粥"] }
    ]
  },
  {
    category: "异国料理",
    icon: "🍣",
    cuisines: [
      { name: "日式料理", dishes: ["豚骨拉面", "日式咖喱饭", "鳗鱼饭", "寿司拼盘", "寿喜锅", "天妇罗盖饭", "大阪烧", "日式烧肉", "亲子丼", "日式汉堡肉"] },
      { name: "韩式料理", dishes: ["石锅拌饭", "韩式炸鸡", "泡菜汤/大酱汤", "韩式冷面", "韩式烤肉", "辣炒年糕", "部队火锅", "紫菜包饭", "参鸡汤"] },
      { name: "东南亚风味", dishes: ["海南鸡饭", "冬阴功汤", "越南河粉(Pho)", "泰式菠萝炒饭", "肉骨茶", "泰式咖喱蟹", "印尼炒饭", "芒果糯米饭", "泰式猪脚饭"] },
      { name: "西餐/意餐", dishes: ["肉酱意面", "牛排", "奶油蘑菇汤", "西班牙海鲜饭", "凯撒沙拉", "烩饭"] }
    ]
  },
  {
    category: "速食/简餐",
    icon: "🍔",
    cuisines: [
      { name: "西式快餐", dishes: ["汉堡薯条套餐", "炸鸡全家桶", "披萨", "热狗", "墨西哥卷饼", "三明治"] },
      { name: "中式快餐", dishes: ["黄焖鸡米饭", "隆江猪脚饭", "沙县小吃", "兰州拉面", "卤肉饭", "排骨米饭", "老鸭粉丝汤", "冒菜", "浏阳蒸菜"] },
      { name: "轻食/减脂", dishes: ["鸡胸肉沙拉", "波奇饭(Poke)", "全麦三明治", "荞麦面", "杂粮饭套餐", "鲜榨果蔬汁", "低脂酸奶碗", "素食卷"] }
    ]
  },
  {
    category: "聚餐/硬菜",
    icon: "🥘",
    cuisines: [
      { name: "火锅/串串", dishes: ["重庆老火锅", "潮汕牛肉火锅", "串串香", "钵钵鸡", "椰子鸡火锅", "寿喜烧", "羊蝎子火锅", "广式打边炉", "鱼头火锅"] },
      { name: "烧烤/烤肉", dishes: ["中式烤串", "韩式烤肉", "日式烧肉", "烤全羊", "烤鱼", "铁板烧", "新疆红柳烤肉", "吊炉烧烤"] },
      { name: "特色大菜", dishes: ["烤鸭", "酸菜鱼", "小龙虾", "大盘鸡", "铁锅炖大鹅", "蒸汽海鲜", "佛跳墙", "海鲜大咖", "烤乳鸽"] }
    ]
  }
];

// --- 辅助函数 ---
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const getAllDishes = () => {
  let all = [];
  FOOD_DATA.forEach(cat => {
    cat.cuisines.forEach(cui => {
      cui.dishes.forEach(dish => {
        all.push({ category: cat.category, cuisine: cui.name, name: dish });
      });
    });
  });
  return all;
};

const getImageUrl = (query) => {
  const encodedQuery = encodeURIComponent(`delicious ${query} food photography, appetizing, michelin star plating, 4k, cinematic lighting`);
  return `https://image.pollinations.ai/prompt/${encodedQuery}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
};

// --- 组件主函数 ---
export default function App() {
  const [mode, setMode] = useState(null); // 'random' | 'guided' | null
  const [stage, setStage] = useState('home'); // 'home' | 'random_running' | ...
  
  const [randomResult, setRandomResult] = useState(null);
  const [shufflingItem, setShufflingItem] = useState(null);
  const [guidedOptions, setGuidedOptions] = useState([]);
  const [selections, setSelections] = useState({ category: null, cuisine: null });
  const [isAnimating, setIsAnimating] = useState(false);

  const resetApp = () => {
    setMode(null);
    setStage('home');
    setRandomResult(null);
    setSelections({ category: null, cuisine: null });
    setGuidedOptions([]);
    setShufflingItem(null);
  };

  const startRandomMode = () => {
    setMode('random');
    setStage('random_running');
    setIsAnimating(true);
    
    const allDishes = getAllDishes();
    let count = 0;
    const maxCount = 25;
    const intervalTime = 100;

    const interval = setInterval(() => {
      setShufflingItem(getRandomItem(allDishes));
      count++;
      if (count > maxCount) {
        clearInterval(interval);
        const finalChoice = getRandomItem(allDishes);
        setRandomResult(finalChoice);
        setStage('random_result');
        setIsAnimating(false);
      }
    }, intervalTime);
  };

  const startGuidedMode = () => {
    setMode('guided');
    setStage('guided_category');
    setGuidedOptions(getRandomItems(FOOD_DATA, 3));
    setSelections({ category: null, cuisine: null });
  };

  const handleCategorySelect = (categoryData) => {
    setSelections(prev => ({ ...prev, category: categoryData }));
    setStage('guided_cuisine');
    const availableCuisines = categoryData.cuisines;
    const count = availableCuisines.length < 3 ? availableCuisines.length : 3;
    setGuidedOptions(getRandomItems(availableCuisines, count));
  };

  const handleCuisineSelect = (cuisineData) => {
    setSelections(prev => ({ ...prev, cuisine: cuisineData }));
    setStage('guided_loading');
    
    setTimeout(() => {
      const finalDishName = getRandomItem(cuisineData.dishes);
      setRandomResult({
        category: selections.category?.category || "",
        cuisine: cuisineData.name,
        name: finalDishName
      });
      setStage('guided_result');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500 selection:text-white flex items-center justify-center p-0 md:p-6">
      
      <div className="w-full max-w-md md:max-w-[420px] bg-neutral-900 min-h-screen md:min-h-[85vh] md:max-h-[90vh] md:rounded-3xl md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-0 md:border md:border-neutral-800 relative flex flex-col justify-between overflow-hidden overflow-y-auto">
        
        <header className="w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent sticky top-0 backdrop-blur-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="bg-orange-500 p-2 rounded-lg">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-wider">干饭指南针 <span className="text-orange-500 text-xs font-normal align-top">beta</span></h1>
          </div>
          {stage !== 'home' && (
            <button 
              onClick={resetApp}
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 bg-neutral-800/50 px-2.5 py-1 rounded-full border border-neutral-700/50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 重置
            </button>
          )}
        </header>

        <main className="w-full px-6 py-4 flex-grow flex flex-col justify-center min-h-[450px]">
          
          {stage === 'home' && (
            <div className="space-y-6 animate-fade-in text-center py-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  今天吃什么？
                </h2>
                <p className="text-neutral-400 text-sm">拯救选择困难症，把胃交给命运。</p>
              </div>

              <div className="grid gap-4 pt-2">
                <button 
                  onClick={startRandomMode}
                  className="group relative overflow-hidden bg-neutral-800 hover:bg-neutral-700/80 p-5 rounded-2xl border border-neutral-700/50 hover:border-orange-500/50 transition-all duration-300 text-left shadow-lg"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shuffle className="w-20 h-20 text-orange-500 transform rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-xl">⚡️</span>
                      <h3 className="text-lg font-bold">一键天命</h3>
                    </div>
                    <p className="text-xs text-neutral-400">简单粗暴，直接随机生成一个完美答案。</p>
                  </div>
                </button>

                <button 
                  onClick={startGuidedMode}
                  className="group relative overflow-hidden bg-neutral-800 hover:bg-neutral-700/80 p-5 rounded-2xl border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-300 text-left shadow-lg"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MapPin className="w-20 h-20 text-blue-500 transform -rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-xl">🧭</span>
                      <h3 className="text-lg font-bold">步步为营</h3>
                    </div>
                    <p className="text-xs text-neutral-400">先选品类，再选菜系，一步步缩小范围。</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {stage === 'random_running' && shufflingItem && (
            <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
              <div className="w-40 h-40 rounded-full bg-neutral-800 border-4 border-orange-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                <span className="text-5xl animate-bounce">
                  {['🍔','🍜','🍣','🥘','🥟','🍝'][Math.floor(Math.random()*6)]}
                </span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-orange-400">{shufflingItem.name}</h3>
                <p className="text-neutral-500 text-sm">{shufflingItem.cuisine} | {shufflingItem.category}</p>
              </div>
              <p className="text-neutral-400 text-xs">正在连接宇宙信号...</p>
            </div>
          )}

          {(stage === 'random_result' || stage === 'guided_result') && randomResult && (
            <div className="animate-scale-in perspective-1000">
              <div className="bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/50 relative">
                <div className="h-48 w-full bg-neutral-900 relative group overflow-hidden">
                   <img 
                     src={getImageUrl(randomResult.name)} 
                     alt={randomResult.name}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       e.target.onerror = null; 
                       e.target.src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000";
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
                   <div className="absolute bottom-0 left-0 p-4 z-10">
                     <div className="flex items-center gap-1 text-orange-400 text-xs font-medium mb-0.5 uppercase">
                        <ChefHat className="w-3.5 h-3.5" />
                        {randomResult.cuisine}
                     </div>
                     <h2 className="text-2xl font-black text-white drop-shadow-md">{randomResult.name}</h2>
                   </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between text-neutral-400 text-xs bg-neutral-900/50 p-3 rounded-xl">
                     <span>所属品类</span>
                     <span className="text-white font-medium">{randomResult.category}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={mode === 'random' ? startRandomMode : handleCuisineSelect.bind(null, selections.cuisine || {name: randomResult.cuisine, dishes: [randomResult.name]})}
                      className="flex items-center justify-center gap-1.5 bg-neutral-700 hover:bg-neutral-600 text-white py-2.5 px-4 rounded-xl transition-colors text-sm font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      换一个
                    </button>
                    <button 
                      onClick={() => {
                        const text = `今天决定吃：${randomResult.name} (${randomResult.cuisine})！`;
                        navigator.clipboard.writeText(text);
                        alert("已复制：" + text);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white py-2.5 px-4 rounded-xl transition-colors text-sm font-bold shadow-lg shadow-orange-500/10"
                    >
                      <Flame className="w-4 h-4" />
                      就吃这个！
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                 <button onClick={resetApp} className="text-neutral-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
                   <ArrowRight className="w-3.5 h-3.5 rotate-180" /> 返回首页
                 </button>
              </div>
            </div>
          )}

          {stage === 'guided_category' && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold text-white">第一步：想吃哪种类型的？</h2>
                <p className="text-xs text-neutral-400 mt-0.5">从以下推荐中翻一张牌</p>
              </div>
              <div className="grid gap-2.5">
                {guidedOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategorySelect(opt)}
                    className="bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/50 p-3 rounded-xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-neutral-900 p-2 flex items-center justify-center rounded-lg">{opt.icon}</span>
                      <div className="text-left">
                        <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">{opt.category}</h3>
                        <p className="text-[10px] text-neutral-400 line-clamp-1">
                          包含: {opt.cuisines.map(c => c.name.split('/')[0]).join(', ')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
              <div className="text-center mt-2">
                 <button onClick={startGuidedMode} className="text-[10px] text-neutral-500 flex items-center justify-center gap-1 mx-auto hover:text-orange-400">
                   <RefreshCw className="w-3 h-3" /> 换一批选项
                 </button>
              </div>
            </div>
          )}

          {stage === 'guided_cuisine' && selections.category && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-2">
                 <div className="inline-flex items-center gap-1 bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 rounded-full text-[10px] text-neutral-400 mb-1">
                   <span>{selections.category.icon} {selections.category.category}</span>
                 </div>
                <h2 className="text-lg font-bold text-white">第二步：更具体一点？</h2>
              </div>
              <div className="grid gap-2.5">
                {guidedOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCuisineSelect(opt)}
                    className="bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/50 p-4 rounded-xl text-center group transition-all"
                  >
                    <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">{opt.name}</h3>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      例如: {opt.dishes.slice(0, 3).join('、')}
                    </p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStage('guided_category')} className="w-full text-neutral-500 text-xs mt-2 hover:text-white flex items-center justify-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> 返回上一步
              </button>
            </div>
          )}

          {stage === 'guided_loading' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-neutral-700 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <ChefHat className="w-5 h-5 text-white/80 animate-bounce" />
                </div>
              </div>
              <div className="text-center space-y-0.5">
                 <p className="text-base font-medium text-white">大厨正在配菜...</p>
                 <p className="text-xs text-neutral-500 font-mono">searching {selections.cuisine?.name}</p>
              </div>
            </div>
          )}

        </main>

        <footer className="w-full text-center text-neutral-600 text-[10px] tracking-wider py-3 border-t border-neutral-800/30 bg-neutral-900/50">
           &copy; 2026 干饭指南针 Food Compass. Beta v0.9
        </footer>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}