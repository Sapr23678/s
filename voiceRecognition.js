// نظام التعرف على هوية الطفل من الصوت - المكتمل
class VoiceIdentification {
    constructor() {
        this.voiceProfiles = {
            sara: null,
            ghaith: null
        };
        this.isTraining = false;
        this.isIdentifying = false;
        this.currentTrainingChild = null;
        this.recognition = null;
        this.audioContext = null;
        this.analyser = null;
        this.init();
    }

    init() {
        this.loadVoiceProfiles();
        this.initSpeechRecognition();
        this.setupTrainingEventListeners();
    }

    loadVoiceProfiles() {
        const savedProfiles = localStorage.getItem('voiceProfiles');
        if (savedProfiles) {
            this.voiceProfiles = JSON.parse(savedProfiles);
            this.updateVoiceSamples();
        }
    }

    saveVoiceProfiles() {
        localStorage.setItem('voiceProfiles', JSON.stringify(this.voiceProfiles));
    }

    updateVoiceSamples() {
        Object.keys(this.voiceProfiles).forEach(child => {
            const sampleElement = document.getElementById(`${child}VoiceSample`);
            if (sampleElement) {
                if (this.voiceProfiles[child]) {
                    sampleElement.classList.add('registered');
                    sampleElement.title = 'الصوت مسجل في النظام';
                    sampleElement.textContent = '✅';
                } else {
                    sampleElement.classList.remove('registered');
                    sampleElement.title = 'الصوت غير مسجل';
                    sampleElement.textContent = '🎤';
                }
            }
        });
    }

    initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showStatus('⚠️ المتصفح لا يدعم التعرف على الصوت. يرجى استخدام Chrome أو Edge', 'error');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ar-SA';
        this.recognition.maxAlternatives = 3;

        this.setupRecognitionEvents();
    }

    setupRecognitionEvents() {
        this.recognition.onstart = () => {
            if (this.isTraining) {
                this.showStatus('🎤 أستماع... قل "مرحبا" بصوت واضح', 'listening');
            } else {
                this.showStatus('🎤 أستماع... تحدث الآن', 'listening');
            }
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            if (this.isTraining) {
                this.processTraining(transcript, confidence);
            } else {
                this.processIdentification(transcript, confidence);
            }
        };

        this.recognition.onerror = (event) => {
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            this.stopListening();
        };
    }

    setupTrainingEventListeners() {
        document.getElementById('trainSaraBtn').addEventListener('click', () => {
            this.startTraining('sara');
        });
        
        document.getElementById('trainGhaithBtn').addEventListener('click', () => {
            this.startTraining('ghaith');
        });
    }

    async startTraining(child) {
        if (!this.recognition) {
            alert('نظام التعرف على الصوت غير متاح');
            return;
        }

        this.isTraining = true;
        this.currentTrainingChild = child;
        
        const childName = this.getChildName(child);
        this.showStatus(`🔊 تدريب صوت ${childName}... اضغط موافق ثم قل "مرحبا"`, 'training');
        
        document.getElementById(`train${child.charAt(0).toUpperCase() + child.slice(1)}Btn`).classList.add('listening');

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recognition.start();
        } catch (error) {
            this.showStatus('❌ لم يتم السماح باستخدام الميكروفون', 'error');
            this.isTraining = false;
            document.getElementById(`train${child.charAt(0).toUpperCase() + child.slice(1)}Btn`).classList.remove('listening');
        }
    }

    processTraining(transcript, confidence) {
        const childName = this.getChildName(this.currentTrainingChild);
        
        if (confidence > 0.3) {
            this.voiceProfiles[this.currentTrainingChild] = {
                transcript: transcript,
                confidence: confidence,
                timestamp: Date.now(),
                features: this.extractVoiceFeatures(transcript, confidence)
            };
            
            this.saveVoiceProfiles();
            this.updateVoiceSamples();
            
            this.showStatus(`✅ تم تدريب صوت ${childName} بنجاح!`, 'success');
            this.playTrainingSuccessSound();
            
            // تأثير بصري
            this.showTrainingSuccessEffect(this.currentTrainingChild);
        } else {
            this.showStatus(`❌ جودة الصوت منخفضة. حاول مرة أخرى بصوت أوضح`, 'error');
        }
        
        this.isTraining = false;
        document.getElementById(`train${this.currentTrainingChild.charAt(0).toUpperCase() + this.currentTrainingChild.slice(1)}Btn`).classList.remove('listening');
    }

    async startIdentification() {
        if (!this.recognition) {
            alert('نظام التعرف على الصوت غير متاح');
            return;
        }

        const trainedVoices = Object.values(this.voiceProfiles).filter(profile => profile !== null);
        if (trainedVoices.length === 0) {
            this.showStatus('⚠️ يرجى تدريب الأصوات أولاً باستخدام أزرار التدريب', 'warning');
            return;
        }

        this.isIdentifying = true;
        this.showStatus('🎤 أستماع... قل "مرحبا" لأعرف من أنت', 'listening');
        document.getElementById('startVoiceIdBtn').classList.add('listening');

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recognition.start();
        } catch (error) {
            this.showStatus('❌ لم يتم السماح باستخدام الميكروفون', 'error');
            this.isIdentifying = false;
            document.getElementById('startVoiceIdBtn').classList.remove('listening');
        }
    }

    processIdentification(transcript, confidence) {
        if (confidence < 0.3) {
            this.showStatus('❌ لم أتمكن من التعرف على الصوت. حاول مرة أخرى بصوت أوضح', 'error');
            this.isIdentifying = false;
            document.getElementById('startVoiceIdBtn').classList.remove('listening');
            return;
        }

        const identifiedChild = this.identifyChild(transcript, confidence);
        
        if (identifiedChild) {
            this.onChildIdentified(identifiedChild);
        } else {
            this.showStatus('❌ لم أتعرف على الصوت. تأكد من التدريب أولاً', 'error');
        }
        
        this.isIdentifying = false;
        document.getElementById('startVoiceIdBtn').classList.remove('listening');
    }

    identifyChild(transcript, confidence) {
        let bestMatch = null;
        let highestScore = 0;

        Object.keys(this.voiceProfiles).forEach(child => {
            const profile = this.voiceProfiles[child];
            if (profile) {
                const score = this.calculateSimilarityScore(transcript, profile, confidence);
                if (score > highestScore && score > 0.6) {
                    highestScore = score;
                    bestMatch = child;
                }
            }
        });

        return bestMatch;
    }

    calculateSimilarityScore(currentTranscript, profile, currentConfidence) {
        const transcriptSimilarity = this.calculateTextSimilarity(currentTranscript, profile.transcript);
        const confidenceScore = (currentConfidence + profile.confidence) / 2;
        const timeScore = this.calculateTimeScore(profile.timestamp);
        
        return (transcriptSimilarity * 0.5) + (confidenceScore * 0.3) + (timeScore * 0.2);
    }

    calculateTextSimilarity(text1, text2) {
        const words1 = this.normalizeText(text1).split(' ');
        const words2 = this.normalizeText(text2).split(' ');
        
        let matches = 0;
        words1.forEach(word1 => {
            if (words2.some(word2 => this.areWordsSimilar(word1, word2))) {
                matches++;
            }
        });
        
        return matches / Math.max(words1.length, words2.length);
    }

    areWordsSimilar(word1, word2) {
        // مقارنة مبسطة للكلمات
        return word1 === word2 || 
               Math.abs(word1.length - word2.length) <= 2 && 
               this.calculateLevenshteinDistance(word1, word2) <= 2;
    }

    calculateLevenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    calculateTimeScore(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const days = diff / (1000 * 60 * 60 * 24);
        
        // تقليل الدرجة كلما مر وقت أطول منذ التدريب
        return Math.max(0, 1 - (days / 30));
    }

    extractVoiceFeatures(transcript, confidence) {
        return {
            length: transcript.length,
            wordCount: transcript.split(' ').length,
            confidence: confidence,
            averageWordLength: transcript.replace(/\s/g, '').length / Math.max(transcript.split(' ').length, 1),
            timestamp: Date.now()
        };
    }

    normalizeText(text) {
        return text
            .replace(/[ًٌٍَُِّّْـ]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    onChildIdentified(child) {
        const childName = this.getChildName(child);
        this.showStatus(`✅ تم التعرف عليك! مرحباً ${childName}!`, 'success');
        
        this.updateUIForIdentifiedChild(child);
        this.playWelcomeSound(child);
        this.showWelcomeMessage(childName);
        
        // إعلام التطبيق الرئيسي
        if (window.kidsLearningApp) {
            kidsLearningApp.setCurrentChild(child);
        }
    }

    updateUIForIdentifiedChild(child) {
        document.querySelectorAll('.kid-avatar').forEach(avatar => {
            avatar.parentElement.classList.remove('identified');
        });
        document.querySelector(`.character[data-character="${child}"]`).classList.add('identified');
        
        document.querySelectorAll('.voice-sample').forEach(sample => {
            sample.classList.remove('identified');
        });
        document.getElementById(`${child}VoiceSample`).classList.add('identified');
    }

    showWelcomeMessage(childName) {
        const welcomeMsg = `مرحباً بعودتك ${childName}! أنا سعيد لرؤيتك. هل أنت مستعد للتعلم؟`;
        
        const identifiedDiv = document.getElementById('identifiedChildDisplay');
        identifiedDiv.innerHTML = `
            <div class="welcome-message">🎉 ${welcomeMsg}</div>
            <div style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                التعرف التلقائي جاهز! اضغط على "ابدأ المغامرة"
            </div>
        `;
        identifiedDiv.style.display = 'block';
        
        // تأثيرات بصرية
        this.showIdentificationSuccessEffect();
    }

    showIdentificationSuccessEffect() {
        const effects = ['🎉', '✨', '⭐', '🎊', '🌟'];
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createFloatingEffect(effects[Math.floor(Math.random() * effects.length)]);
            }, i * 100);
        }
    }

    showTrainingSuccessEffect(child) {
        const avatar = document.querySelector(`.character[data-character="${child}"] .kid-avatar`);
        if (avatar) {
            avatar.classList.add('glow');
            setTimeout(() => {
                avatar.classList.remove('glow');
            }, 2000);
        }
    }

    createFloatingEffect(emoji) {
        const effect = document.createElement('div');
        effect.textContent = emoji;
        effect.style.position = 'fixed';
        effect.style.fontSize = '2rem';
        effect.style.zIndex = '1000';
        effect.style.pointerEvents = 'none';
        effect.style.animation = `float 2s ease-out forwards, fadeOut 2s ease-out forwards`;
        effect.style.left = Math.random() * 100 + 'vw';
        effect.style.top = '100vh';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isTraining = false;
        this.isIdentifying = false;
        
        document.getElementById('startVoiceIdBtn').classList.remove('listening');
        document.querySelectorAll('.train-btn').forEach(btn => {
            btn.classList.remove('listening');
        });
    }

    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('voiceStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `voice-status ${type}`;
            
            if (type === 'listening') {
                statusElement.classList.add('listening');
            } else {
                statusElement.classList.remove('listening');
            }
        }
    }

    handleRecognitionError(error) {
        const errorMessages = {
            'no-speech': 'لم يتم الكشف عن كلام. حاول التحدث بصوت أعلى',
            'audio-capture': 'لا يمكن الوصول إلى الميكروفون',
            'not-allowed': 'تم رفض الإذن باستخدام الميكروفون. يرجى السماح باستخدام الميكروفون',
            'network': 'خطأ في الشبكة. تحقق من اتصال الإنترنت',
            'not-supported': 'المتصفح لا يدعم هذه الميزة',
            'service-not-allowed': 'خدمة التعرف على الصوت غير متاحة'
        };
        
        this.showStatus(`❌ ${errorMessages[error] || 'خطأ غير معروف'}`, 'error');
        this.stopListening();
    }

    getChildName(child) {
        return child === 'sara' ? 'سارة' : 'غيث';
    }

    playTrainingSuccessSound() {
        this.playSound('assets/sounds/feedback/training_success.mp3');
    }

    playWelcomeSound(child) {
        this.playSound(`assets/sounds/welcome/${child}_welcome.mp3`);
    }

    playSound(soundPath) {
        const audio = new Audio(soundPath);
        audio.play().catch(() => {
            // تجاهل الأخطاء إذا لم يكن الصوت متوفراً
        });
    }

    // دالة مساعدة للتحقق من جاهزية النظام
    isSystemReady() {
        return Object.values(this.voiceProfiles).some(profile => profile !== null);
    }

    // الحصول على إحصائيات النظام
    getSystemStats() {
        const trained = Object.values(this.voiceProfiles).filter(p => p !== null).length;
        const total = Object.keys(this.voiceProfiles).length;
        
        return {
            trainedVoices: trained,
            totalVoices: total,
            readiness: trained > 0
        };
    }
}

// التصدير للاستخدام العالمي
window.VoiceIdentification = VoiceIdentification;

// التهيئة التلقائية
let voiceSystem;

document.addEventListener('DOMContentLoaded', function() {
    voiceSystem = new VoiceIdentification();
    
    // ربط الأزرار
    document.getElementById('startVoiceIdBtn').addEventListener('click', () => {
        voiceSystem.startIdentification();
    });
});