// التطبيق الرئيسي المتكامل - النسخة النهائية
class KidsLearningApp {
    constructor() {
        this.currentChild = null;
        this.isInitialized = false;
        this.appData = {
            currentEpisode: 1,
            encouragementMessages: {
                sara: [
                    { text: 'أحسنت يا سارة!', sound: 'assets/sounds/feedback/sara/great.mp3' },
                    { text: 'رائع يا سارة!', sound: 'assets/sounds/feedback/sara/excellent.mp3' },
                    { text: 'ذكية يا سارة!', sound: 'assets/sounds/feedback/sara/smart.mp3' },
                    { text: 'مبدعة يا سارة!', sound: 'assets/sounds/feedback/sara/creative.mp3' }
                ],
                ghaith: [
                    { text: 'أحسنت يا غيث!', sound: 'assets/sounds/feedback/ghaith/great.mp3' },
                    { text: 'رائع يا غيث!', sound: 'assets/sounds/feedback/ghaith/excellent.mp3' },
                    { text: 'ذكي يا غيث!', sound: 'assets/sounds/feedback/ghaith/smart.mp3' },
                    { text: 'مبدع يا غيث!', sound: 'assets/sounds/feedback/ghaith/creative.mp3' }
                ],
                general: [
                    { text: 'ممتاز!', sound: 'assets/sounds/feedback/general/excellent.mp3' },
                    { text: 'عمل رائع!', sound: 'assets/sounds/feedback/general/great_job.mp3' },
                    { text: 'استمر هكذا!', sound: 'assets/sounds/feedback/general/keep_going.mp3' }
                ]
            },
            learningProgress: {
                episodes: {},
                objectives: {}
            }
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupAppEventListeners();
        this.loadImages();
        this.initializeAllSystems();
        this.isInitialized = true;
        
        console.log('🚀 تطبيق مغامرات سارة وغيث - جاهز للعمل!');
    }

    setupAppEventListeners() {
        // زر بدء المغامرة
        document.getElementById('startEpisodeBtn').addEventListener('click', () => {
            this.startAdventure();
        });

        // زر التحكم بالصوت
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        // زر القائمة
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.toggleEpisodesMenu();
        });

        // تحميل الصور عند ظهورها
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }

    initializeAllSystems() {
        // تهيئة جميع الأنظمة
        try {
            if (typeof VoiceIdentification !== 'undefined') {
                this.voiceSystem = new VoiceIdentification();
                console.log('✅ نظام التعرف على الصوت - جاهز');
            }
            
            if (typeof CartoonEngine !== 'undefined') {
                this.cartoonEngine = new CartoonEngine();
                console.log('✅ محرك الكرتون - جاهز');
            }
            
            if (typeof StoryManager !== 'undefined') {
                this.storyManager = new StoryManager();
                console.log('✅ مدير القصة - جاهز');
            }
            
            if (typeof LearningManager !== 'undefined') {
                this.learningManager = new LearningManager();
                console.log('✅ مدير التعلم - جاهز');
            }
        } catch (error) {
            console.error('❌ خطأ في تهيئة الأنظمة:', error);
        }
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('kidsLearningProgress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.appData.learningProgress = progress;
                this.appData.currentEpisode = progress.currentEpisode || 1;
            } catch (error) {
                console.error('خطأ في تحميل التقدم:', error);
            }
        }
    }

    saveProgress() {
        this.appData.learningProgress.currentEpisode = this.appData.currentEpisode;
        localStorage.setItem('kidsLearningProgress', JSON.stringify(this.appData.learningProgress));
    }

    loadImages() {
        // تحميل الصور مع معالجة الأخطاء
        const images = document.querySelectorAll('.kid-photo');
        images.forEach(img => {
            this.loadImage(img);
        });
    }

    loadImage(imgElement) {
        const src = imgElement.src;
        const fallback = imgElement.getAttribute('data-fallback');
        
        imgElement.onerror = () => {
            if (fallback) {
                imgElement.src = fallback;
            } else {
                imgElement.style.display = 'none';
                imgElement.nextElementSibling.style.display = 'block';
            }
        };
        
        imgElement.onload = () => {
            imgElement.parentElement.classList.add('loaded');
        };
    }

    startAdventure() {
        if (!this.currentChild) {
            this.showMessage('⚠️ يرجى التعرف على صوتك أولاً باستخدام نظام التعرف على الصوت');
            return;
        }

        // تأثيرات الانتقال
        this.showTransitionEffect()
            .then(() => {
                document.getElementById('introScreen').classList.remove('active');
                document.getElementById('mainScene').classList.add('active');
                
                if (this.cartoonEngine) {
                    this.cartoonEngine.startEpisode();
                }
                
                this.showWelcomeMessage();
                this.startBackgroundMusic();
            });
    }

    showTransitionEffect() {
        return new Promise((resolve) => {
            const transition = document.createElement('div');
            transition.className = 'scene-transition';
            transition.innerHTML = `
                <div class="scene-transition-content">
                    <div class="loading-spinner">✨</div>
                    <div>جاري التحضير للمغامرة...</div>
                </div>
            `;
            
            document.body.appendChild(transition);
            
            setTimeout(() => {
                transition.remove();
                resolve();
            }, 1500);
        });
    }

    showWelcomeMessage() {
        if (this.currentChild && this.cartoonEngine) {
            const childName = this.currentChild === 'sara' ? 'سارة' : 'غيث';
            this.cartoonEngine.showDialogue(`مرحباً ${childName}! هيا نبدأ رحلة التعلم الممتعة!`);
            
            // تشغيل صوت ترحيبي
            this.playSound(`assets/sounds/welcome/${this.currentChild}_adventure.mp3`);
        }
    }

    startBackgroundMusic() {
        if (this.cartoonEngine) {
            this.cartoonEngine.playBackgroundMusic();
        }
    }

    setCurrentChild(child) {
        this.currentChild = child;
        document.getElementById('startEpisodeBtn').disabled = false;
        
        // تحديث الواجهة
        this.updateUIForChild(child);
        
        // حفظ التفضيل
        localStorage.setItem('lastIdentifiedChild', child);
        
        console.log(`👤 الطفل الحالي: ${child}`);
    }

    updateUIForChild(child) {
        // تحديث الشخصيات في الشاشة الافتتاحية
        document.querySelectorAll('.character-intro .character').forEach(char => {
            char.classList.remove('identified');
        });
        document.querySelector(`.character-intro .character[data-character="${child}"]`).classList.add('identified');
        
        // تحديث عينات الصوت
        document.querySelectorAll('.voice-sample').forEach(sample => {
            sample.classList.remove('identified');
        });
        document.getElementById(`${child}VoiceSample`).classList.add('identified');
        
        // عرض رسالة الترحيب
        const childName = child === 'sara' ? 'سارة' : 'غيث';
        const identifiedDiv = document.getElementById('identifiedChildDisplay');
        identifiedDiv.innerHTML = `
            <div class="welcome-message">🎉 مرحباً ${childName}!</div>
            <div class="sub-message">تم التعرف عليك بنجاح. اضغط على "ابدأ المغامرة"</div>
        `;
        identifiedDiv.style.display = 'block';
    }

    toggleVoiceRecognition() {
        if (this.voiceSystem) {
            this.voiceSystem.startIdentification();
        } else {
            this.showMessage('نظام التعرف على الصوت غير متاح حالياً');
        }
    }

    toggleEpisodesMenu() {
        const menu = document.getElementById('episodesMenu');
        menu.classList.toggle('active');
        
        if (menu.classList.contains('active') && this.storyManager) {
            this.storyManager.updateEpisodesDisplay();
        }
    }

    showEncouragement() {
        if (!this.currentChild) return;
        
        const messages = [
            ...this.appData.encouragementMessages[this.currentChild],
            ...this.appData.encouragementMessages.general
        ];
        
        const randomIndex = Math.floor(Math.random() * messages.length);
        const message = messages[randomIndex];
        
        this.showFeedback(message.text, message.sound);
    }

    showFeedback(message, soundPath = null) {
        document.getElementById('feedbackMessage').textContent = message;
        document.getElementById('feedbackChild').textContent = this.currentChild ? 
            (this.currentChild === 'sara' ? 'لـ سارة' : 'لـ غيث') : '';
        
        const overlay = document.getElementById('feedbackOverlay');
        overlay.style.display = 'flex';
        
        // تشغيل الصوت إذا كان متوفراً
        if (soundPath && this.cartoonEngine) {
            this.cartoonEngine.playSound(soundPath);
        }
        
        // إضافة تأثيرات النجاح
        this.createFeedbackEffects();
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3000);
    }

    createFeedbackEffects() {
        // إضافة نجووم متحركة
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createStarParticle();
            }, i * 100);
        }
    }

    createStarParticle() {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.textContent = '⭐';
        star.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
        star.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        document.body.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 2000);
    }

    playSound(soundPath) {
        if (this.cartoonEngine) {
            this.cartoonEngine.playSound(soundPath);
        }
    }

    showMessage(message, type = 'info') {
        // تنفيذ مبسط لعرض الرسائل
        console.log(`${type}: ${message}`);
        
        if (type === 'error') {
            alert(`⚠️ ${message}`);
        }
    }

    completeObjective(objectiveId) {
        if (!this.appData.learningProgress.objectives) {
            this.appData.learningProgress.objectives = {};
        }
        
        this.appData.learningProgress.objectives[objectiveId] = {
            completed: true,
            timestamp: Date.now(),
            child: this.currentChild
        };
        
        this.saveProgress();
        this.showEncouragement();
        
        // التحقق من إكمال الحلقة
        this.checkEpisodeCompletion();
    }

    checkEpisodeCompletion() {
        const objectives = this.appData.learningProgress.objectives;
        const completed = Object.values(objectives).filter(obj => obj.completed).length;
        
        if (completed >= 3) { // مثال: 3 أهداف لإكمال الحلقة
            this.completeCurrentEpisode();
        }
    }

    completeCurrentEpisode() {
        if (!this.appData.learningProgress.episodes) {
            this.appData.learningProgress.episodes = {};
        }
        
        this.appData.learningProgress.episodes[this.appData.currentEpisode] = {
            completed: true,
            completionDate: new Date().toISOString(),
            child: this.currentChild
        };
        
        this.appData.currentEpisode++;
        this.saveProgress();
        
        this.showEpisodeCompletionCelebration();
    }

    showEpisodeCompletionCelebration() {
        this.showFeedback('🎉 مبروك! لقد أكملت الحلقة بنجاح!', 'assets/sounds/feedback/success.mp3');
        
        // تأثيرات احتفالية
        this.createConfettiEffect();
        
        if (this.cartoonEngine) {
            this.cartoonEngine.showDialogue('مذهل! لقد أكملت الحلقة بنجاح. هل تريد الانتقال للحلقة التالية؟');
        }
    }

    createConfettiEffect() {
        const confettiEmojis = ['🎉', '✨', '🎊', '⭐', '🌟', '💫', '🎈', '🥳'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.fontSize = `${Math.random() * 20 + 15}px`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 100);
        }
    }

    // الحصول على إحصائيات التطبيق
    getAppStats() {
        return {
            currentChild: this.currentChild,
            currentEpisode: this.appData.currentEpisode,
            completedObjectives: Object.values(this.appData.learningProgress.objectives || {}).filter(obj => obj.completed).length,
            completedEpisodes: Object.values(this.appData.learningProgress.episodes || {}).filter(ep => ep.completed).length,
            totalPlayTime: this.calculateTotalPlayTime(),
            voiceSystemReady: this.voiceSystem ? this.voiceSystem.isSystemReady() : false
        };
    }

    calculateTotalPlayTime() {
        // حساب وقت اللعب الإجمالي (مبسط)
        const sessions = JSON.parse(localStorage.getItem('playSessions') || '[]');
        return sessions.reduce((total, session) => total + session.duration, 0);
    }

    // إعادة التعيين
    resetProgress() {
        if (confirm('هل أنت متأكد من رغبتك في مسح كل التقدم؟')) {
            localStorage.removeItem('kidsLearningProgress');
            localStorage.removeItem('voiceProfiles');
            localStorage.removeItem('lastIdentifiedChild');
            localStorage.removeItem('playSessions');
            
            this.appData.learningProgress = { episodes: {}, objectives: {} };
            this.appData.currentEpisode = 1;
            this.currentChild = null;
            
            location.reload();
        }
    }
}

// التهيئة العالمية
window.KidsLearningApp = KidsLearningApp;

// بدء التطبيق
let kidsLearningApp;

document.addEventListener('DOMContentLoaded', function() {
    kidsLearningApp = new KidsLearningApp();
    
    // جعل التطبيق متاحاً globally لل debugging
    window.app = kidsLearningApp;
    
    // تحميل الطفل الأخير إذا كان موجوداً
    const lastChild = localStorage.getItem('lastIdentifiedChild');
    if (lastChild && kidsLearningApp.voiceSystem) {
        kidsLearningApp.setCurrentChild(lastChild);
    }
});

// إضافة styles للعناصر الديناميكية
const dynamicStyles = `
    .loading-spinner {
        font-size: 3rem;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    .sub-message {
        font-size: 0.9em;
        opacity: 0.8;
        margin-top: 5px;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
