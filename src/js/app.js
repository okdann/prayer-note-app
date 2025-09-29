/**
 * 메인 애플리케이션
 */

const App = {
    /**
     * 앱 초기화
     */
    init: function() {
        // 로그인 체크
        if (Auth.isLoggedIn()) {
            this.showMainApp();
        } else {
            this.showStartScreen();
        }
        
        this.bindEvents();
    },
    
    /**
     * 이벤트 바인딩
     */
    bindEvents: function() {
        // 시작 화면
        const startBtn = document.getElementById('startBtn');
        const userNameInput = document.getElementById('userName');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStart());
        }
        
        if (userNameInput) {
            userNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleStart();
            });
        }
        
        // 로그아웃
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // 도움말
        const helpBtn = document.getElementById('helpBtn');
        const closeHelp = document.getElementById('closeHelp');
        const helpModal = document.getElementById('helpModal');
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                Utils.show(helpModal);
            });
        }
        
        if (closeHelp) {
            closeHelp.addEventListener('click', () => {
                Utils.hide(helpModal);
            });
        }
        
        // 모달 외부 클릭시 닫기
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    Utils.hide(helpModal);
                }
            });
        }
    },
    
    /**
     * 시작 처리
     */
    handleStart: function() {
        const userNameInput = document.getElementById('userName');
        const username = userNameInput.value.trim();
        
        const result = Auth.login(username);
        
        if (result.success) {
            this.showMainApp();
        } else {
            Utils.showAlert(result.message);
        }
    },
    
    /**
     * 로그아웃 처리
     */
    handleLogout: function() {
        if (confirm('로그아웃 하시겠습니까?')) {
            Auth.logout();
            this.showStartScreen();
            window.location.reload(); // 페이지 새로고침
        }
    },
    
    /**
     * 시작 화면 표시
     */
    showStartScreen: function() {
        const startScreen = document.getElementById('startScreen');
        const mainApp = document.getElementById('mainApp');
        
        Utils.show(startScreen);
        Utils.hide(mainApp);
        
        // 입력 필드에 포커스
        const userNameInput = document.getElementById('userName');
        if (userNameInput) {
            userNameInput.focus();
        }
    },
    
    /**
     * 메인 앱 표시
     */
    showMainApp: function() {
        const startScreen = document.getElementById('startScreen');
        const mainApp = document.getElementById('mainApp');
        
        Utils.hide(startScreen);
        Utils.show(mainApp);
        
        // 헤더 업데이트
        const headerTitle = document.getElementById('headerTitle');
        if (headerTitle) {
            headerTitle.textContent = `${Auth.getCurrentUser()}님의 기도노트`;
        }
        
        // 기도 관리 초기화
        Prayers.init();
        Prayers.updateStats();
        
        // 입력 필드에 포커스
        const prayerInput = document.getElementById('prayerInput');
        if (prayerInput) {
            prayerInput.focus();
        }
    }
};

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});