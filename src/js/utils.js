/**
 * 유틸리티 함수 모음
 */

const Utils = {
    /**
     * 날짜 포맷팅
     */
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        
        // 오늘인지 체크
        if (this.isSameDay(date, today)) {
            return '오늘';
        }
        
        // 어제인지 체크
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (this.isSameDay(date, yesterday)) {
            return '어제';
        }
        
        // 올해인지 체크
        if (date.getFullYear() === today.getFullYear()) {
            return `${date.getMonth() + 1}월 ${date.getDate()}일`;
        }
        
        // 다른 연도
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    },
    
    /**
     * 같은 날인지 체크
     */
    isSameDay: function(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },
    
    /**
     * 고유 ID 생성
     */
    generateId: function() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * 문자열 이스케이프 (XSS 방지)
     */
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },
    
    /**
     * 디바운스 함수
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 요소 표시/숨김
     */
    show: function(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    },
    
    hide: function(element) {
        if (element) {
            element.classList.add('hidden');
        }
    },
    
    /**
     * 알림 메시지
     */
    showAlert: function(message, type = 'info') {
        // 간단한 alert 사용 (나중에 토스트 메시지로 업그레이드 가능)
        alert(message);
    }
};