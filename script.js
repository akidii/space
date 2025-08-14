// 个人能力地图九宫格拼图交互逻辑
class PuzzleGame {
    constructor() {
        this.completedPieces = new Set();
        this.totalPieces = 9;
        this.isGameCompleted = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadProgress();
    }
    
    bindEvents() {
        // 绑定拼图块点击事件
        const puzzlePieces = document.querySelectorAll('.puzzle-piece');
        puzzlePieces.forEach(piece => {
            piece.addEventListener('click', (e) => this.handlePieceClick(e));
        });
        
        // 绑定弹窗关闭按钮事件
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeModal());
        }
        
        // 绑定弹窗背景点击关闭事件
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    handlePieceClick(event) {
        const piece = event.currentTarget;
        const pieceIndex = piece.dataset.index;
        const pageName = piece.dataset.page;
        
        // 如果已经完成，直接跳转
        if (this.completedPieces.has(pieceIndex)) {
            this.navigateToPage(pageName);
            return;
        }
        
        // 标记为已完成
        this.markPieceAsCompleted(pieceIndex);
        
        // 保存进度到本地存储
        this.saveProgress();
        
        // 检查是否所有拼图都完成
        if (this.completedPieces.size === this.totalPieces) {
            this.completeGame();
        } else {
            // 延迟跳转，让用户看到完成动画
            setTimeout(() => {
                this.navigateToPage(pageName);
            }, 800);
        }
    }
    
    markPieceAsCompleted(pieceIndex) {
        const piece = document.querySelector(`[data-index="${pieceIndex}"]`);
        if (piece && !piece.classList.contains('completed')) {
            piece.classList.add('completed');
            this.completedPieces.add(pieceIndex);
            
            // 添加完成动画效果
            this.animatePieceCompletion(piece);
        }
    }
    
    animatePieceCompletion(piece) {
        // 添加脉冲动画
        piece.style.animation = 'none';
        piece.offsetHeight; // 触发重排
        piece.style.animation = 'pulse 0.6s ease-out';
        
        // 添加完成音效提示（可选）
        this.playCompletionSound();
    }
    
    playCompletionSound() {
        // 创建简单的音效提示
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            // 如果音频API不可用，静默处理
            console.log('音频API不可用');
        }
    }
    
    completeGame() {
        if (this.isGameCompleted) return;
        
        this.isGameCompleted = true;
        
        // 显示背景图案
        this.showBackgroundPattern();
        
        // 延迟显示完成弹窗
        setTimeout(() => {
            this.showCompletionModal();
        }, 1000);
        
        // 保存完成状态
        localStorage.setItem('puzzleGameCompleted', 'true');
    }
    
    showBackgroundPattern() {
        const backgroundPattern = document.getElementById('backgroundPattern');
        if (backgroundPattern) {
            backgroundPattern.classList.add('show');
        }
    }
    
    showCompletionModal() {
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
    }
    
    closeModal() {
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // 恢复滚动
        }
    }
    
    navigateToPage(pageName) {
        // 创建对应的页面URL
        const pageUrls = {
            'execution': 'pages/execution.html',
            'product': 'pages/product.html',
            'analysis': 'pages/analysis.html',
            'tools': 'pages/tools.html',
            'ideas': 'pages/ideas.html',
            'learning': 'pages/learning.html',
            'about': 'pages/about.html',
            'projects': 'pages/projects.html',
            'contact': 'pages/contact.html'
        };
        
        const targetUrl = pageUrls[pageName] || `pages/${pageName}.html`;
        
        // 在新标签页中打开页面
        window.open(targetUrl, '_blank');
    }
    
    saveProgress() {
        const progress = Array.from(this.completedPieces);
        localStorage.setItem('puzzleGameProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        try {
            // 加载拼图完成进度
            const savedProgress = localStorage.getItem('puzzleGameProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                progress.forEach(pieceIndex => {
                    this.markPieceAsCompleted(pieceIndex);
                });
            }
            
            // 检查是否已经完成游戏
            const isCompleted = localStorage.getItem('puzzleGameCompleted');
            if (isCompleted === 'true') {
                this.isGameCompleted = true;
                this.showBackgroundPattern();
            }
        } catch (error) {
            console.error('加载进度失败:', error);
        }
    }
    
    resetGame() {
        // 重置游戏状态
        this.completedPieces.clear();
        this.isGameCompleted = false;
        
        // 移除所有完成状态
        const pieces = document.querySelectorAll('.puzzle-piece');
        pieces.forEach(piece => {
            piece.classList.remove('completed');
        });
        
        // 隐藏背景图案
        const backgroundPattern = document.getElementById('backgroundPattern');
        if (backgroundPattern) {
            backgroundPattern.classList.remove('show');
        }
        
        // 清除本地存储
        localStorage.removeItem('puzzleGameProgress');
        localStorage.removeItem('puzzleGameCompleted');
        
        console.log('游戏已重置');
    }
}

// 添加脉冲动画CSS
const pulseAnimation = `
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(0.95);
    }
}
`;

// 将动画添加到页面
const style = document.createElement('style');
style.textContent = pulseAnimation;
document.head.appendChild(style);

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 初始化拼图游戏
    const puzzleGame = new PuzzleGame();
    
    // 将游戏实例添加到全局作用域，方便调试
    window.puzzleGame = puzzleGame;
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // Ctrl + R 重置游戏
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            puzzleGame.resetGame();
        }
        
        // ESC 关闭弹窗
        if (e.key === 'Escape') {
            puzzleGame.closeModal();
        }
    });
    
    console.log('个人能力地图九宫格拼图游戏已初始化！');
    console.log('提示：按 Ctrl+R 可以重置游戏进度');
});
