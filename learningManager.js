// مدير نظام التعلم المتكامل
class LearningManager {
    constructor() {
        this.currentSection = null;
        this.isLearningActive = false;
        this.init();
    }

    init() {
        this.setupLearningEventListeners();
        this.initLearningSections();
    }

    setupLearningEventListeners() {
        // العناصر التفاعلية في المشهد
        document.getElementById('magicBook').addEventListener('click', () => this.showLearningSections());
        document.getElementById('learningMap').addEventListener('click', () => this.showEpisodesMenu());
        document.getElementById('quranBook').addEventListener('click', () => this.showQuranSection());

        // أزرار العودة
        document.getElementById('backToSceneBtn').addEventListener('click', () => this.hideLearningScreen());
        document.getElementById('backFromArabicBtn').addEventListener('click', () => this.showLearningSections());
        document.getElementById('backFromEnglishBtn').addEventListener('click', () => this.showLearningSections());
        document.getElementById('backFromQuranBtn').addEventListener('click', () => this.showLearningSections());

        // أقسام التعلم
        document.querySelectorAll('.section-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.showLearningSection(section);
            });
        });

        // إغلاق قائمة الحلقات
        document.getElementById('closeEpisodesBtn').addEventListener('click', () => {
            document.getElementById('episodesMenu').classList.remove('active');
        });
    }

    initLearningSections() {
        this.initArabicLetters();
        this.initEnglishLetters();
        this.initQuranSuras();
    }

    showLearningSections() {
        this.hideAllLearningScreens();
        document.getElementById('sectionsLearningScreen').classList.add('active');
        document.querySelector('.learning-screens').style.display = 'flex';
        this.playSound('assets/sounds/effects/magic.mp3');
    }

    showLearningSection(section) {
        this.hideAllLearningScreens();
        
        switch(section) {
            case 'arabic':
                document.getElementById('arabicLearningScreen').classList.add('active');
                break;
            case 'english':
                document.getElementById('englishLearningScreen').classList.add('active');
                break;
            case 'quran':
                document.getElementById('quranLearningScreen').classList.add('active');
                break;
        }
        
        this.playSound('assets/sounds/effects/click.mp3');
    }

    hideLearningScreen() {
        document.querySelector('.learning-screens').style.display = 'none';
        this.hideAllLearningScreens();
        this.playSound('assets/sounds/effects/click.mp3');
    }

    hideAllLearningScreens() {
        document.querySelectorAll('.learning-screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    showEpisodesMenu() {
        document.getElementById('episodesMenu').classList.add('active');
        this.playSound('assets/sounds/effects/map.mp3');
    }

    showQuranSection() {
        this.showLearningSection('quran');
    }

    // نظام الحروف العربية
    initArabicLetters() {
        const arabicLetters = [
            { letter: 'أ', word: 'أرنب', image: '🐇' },
            { letter: 'ب', word: 'باب', image: '🚪' },
            { letter: 'ت', word: 'تفاحة', image: '🍎' },
            { letter: 'ث', word: 'ثور', image: '🐂' },
            { letter: 'ج', word: 'جمل', image: '🐫' },
            { letter: 'ح', word: 'حوت', image: '🐋' },
            { letter: 'خ', word: 'خروف', image: '🐑' },
            { letter: 'د', word: 'دولفين', image: '🐬' },
            { letter: 'ذ', word: 'ذئب', image: '🐺' },
            { letter: 'ر', word: 'ريشة', image: '🪶' },
            { letter: 'ز', word: 'زرافة', image: '🦒' },
            { letter: 'س', word: 'سيارة', image: '🚗' },
            { letter: 'ش', word: 'شمس', image: '☀️' },
            { letter: 'ص', word: 'صقر', image: '🦅' },
            { letter: 'ض', word: 'ضفدع', image: '🐸' },
            { letter: 'ط', word: 'طائرة', image: '✈️' },
            { letter: 'ظ', word: 'ظبي', image: '🦌' },
            { letter: 'ع', word: 'عصفور', image: '🐦' },
            { letter: 'غ', word: 'غزال', image: '🦌' },
            { letter: 'ف', word: 'فيل', image: '🐘' },
            { letter: 'ق', word: 'قرد', image: '🐒' },
            { letter: 'ك', word: 'كتاب', image: '📚' },
            { letter: 'ل', word: 'ليمون', image: '🍋' },
            { letter: 'م', word: 'موز', image: '🍌' },
            { letter: 'ن', word: 'نمر', image: '🐅' },
            { letter: 'ه', word: 'هدهد', image: '🐦' },
            { letter: 'و', word: 'وردة', image: '🌹' },
            { letter: 'ي', word: 'يمامة', image: '🕊️' }
        ];

        const grid = document.getElementById('arabicLettersGrid');
        arabicLetters.forEach(letter => {
            const card = this.createLetterCard(letter, 'arabic');
            grid.appendChild(card);
        });
    }

    // نظام الحروف الإنجليزية
    initEnglishLetters() {
        const englishLetters = [
            { letter: 'A', word: 'Apple', image: '🍎' },
            { letter: 'B', word: 'Ball', image: '⚽' },
            { letter: 'C', word: 'Cat', image: '🐱' },
            { letter: 'D', word: 'Dog', image: '🐶' },
            { letter: 'E', word: 'Elephant', image: '🐘' },
            { letter: 'F', word: 'Fish', image: '🐠' },
            { letter: 'G', word: 'Giraffe', image: '🦒' },
            { letter: 'H', word: 'House', image: '🏠' },
            { letter: 'I', word: 'Ice Cream', image: '🍦' },
            { letter: 'J', word: 'Jellyfish', image: '🎐' },
            { letter: 'K', word: 'Kite', image: '🪁' },
            { letter: 'L', word: 'Lion', image: '🦁' },
            { letter: 'M', word: 'Moon', image: '🌙' },
            { letter: 'N', word: 'Nest', image: '🪹' },
            { letter: 'O', word: 'Orange', image: '🍊' },
            { letter: 'P', word: 'Pencil', image: '✏️' },
            { letter: 'Q', word: 'Queen', image: '👑' },
            { letter: 'R', word: 'Rainbow', image: '🌈' },
            { letter: 'S', word: 'Sun', image: '☀️' },
            { letter: 'T', word: 'Tree', image: '🌳' },
            { letter: 'U', word: 'Umbrella', image: '☂️' },
            { letter: 'V', word: 'Violin', image: '🎻' },
            { letter: 'W', word: 'Watermelon', image: '🍉' },
            { letter: 'X', word: 'Xylophone', image: '🎹' },
            { letter: 'Y', word: 'Yacht', image: '⛵' },
            { letter: 'Z', word: 'Zebra', image: '🦓' }
        ];

        const grid = document.getElementById('englishLettersGrid');
        englishLetters.forEach(letter => {
            const card = this.createLetterCard(letter, 'english');
            grid.appendChild(card);
        });
    }

    createLetterCard(letterData, type) {
        const card = document.createElement('div');
        card.className = 'letter-card magical-card';
        card.textContent = letterData.letter;
        card.addEventListener('click', () => this.showLetterExample(letterData, type));
        return card;
    }

    showLetterExample(letterData, type) {
        if (type === 'arabic') {
            document.getElementById('arabicLetterDisplay').textContent = letterData.letter;
            document.getElementById('arabicWord').textContent = letterData.word;
            document.getElementById('arabicImage').textContent = letterData.image;
        } else {
            document.getElementById('englishLetterDisplay').textContent = letterData.letter;
            document.getElementById('englishWord').textContent = letterData.word;
            document.getElementById('englishImage').textContent = letterData.image;
        }
        
        this.playSound('assets/sounds/effects/success.mp3');
        if (window.cartoonEngine) {
            cartoonEngine.createSuccessEffect();
        }
        if (window.storyManager && window.appData.currentChild) {
            storyManager.completeObjective(1, 0); // إكمال هدف التعلم
        }
    }

    // نظام القرآن الكريم
    initQuranSuras() {
        const quranSuras = [
            { name: 'سورة الناس', file: 'assets/sounds/quran/114.mp3' },
            { name: 'سورة الفلق', file: 'assets/sounds/quran/113.mp3' },
            { name: 'سورة الإخلاص', file: 'assets/sounds/quran/112.mp3' },
            { name: 'سورة المسد', file: 'assets/sounds/quran/111.mp3' },
            { name: 'سورة النصر', file: 'assets/sounds/quran/110.mp3' }
        ];

        const list = document.getElementById('surasList');
        quranSuras.forEach(sura => {
            const card = this.createSuraCard(sura);
            list.appendChild(card);
        });

        this.setupAudioControls();
    }

    createSuraCard(sura) {
        const card = document.createElement('div');
        card.className = 'sura-card magical-card';
        card.innerHTML = `
            <div class="sura-name">${sura.name}</div>
            <div class="play-icon">▶️</div>
        `;
        card.addEventListener('click', () => this.selectSura(sura));
        return card;
    }

    selectSura(sura) {
        document.getElementById('nowPlaying').textContent = `جاري التشغيل: ${sura.name}`;
        this.playSound('assets/sounds/effects/click.mp3');
        
        // هنا يمكن إضافة تشغيل السورة
        setTimeout(() => {
            if (window.cartoonEngine) {
                cartoonEngine.showDialogue(`الآن نستمع إلى ${sura.name}`);
            }
        }, 1000);
    }

    setupAudioControls() {
        document.getElementById('playBtn').addEventListener('click', () => {
            this.playSound('assets/sounds/effects/success.mp3');
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.playSound('assets/sounds/effects/click.mp3');
        });
    }

    playSound(soundPath) {
        if (window.cartoonEngine && cartoonEngine.isSoundOn) {
            cartoonEngine.playSound(soundPath);
        }
    }
}

// تهيئة مدير التعلم
let learningManager;

document.addEventListener('DOMContentLoaded', function() {
    learningManager = new LearningManager();
});