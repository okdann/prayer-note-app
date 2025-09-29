/**
 * 로컬 스토리지 관리
 */

const Storage = {
    // 키 설정
    KEYS: {
        USER: 'prayer_app_user',
        PRAYERS: 'prayer_app_prayers',
        SETTINGS: 'prayer_app_settings'
    },
    
    /**
     * 데이터 저장
     */
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },
    
    /**
     * 데이터 불러오기
     */
    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    },
    
    /**
     * 데이터 삭제
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    /**
     * 전체 데이터 초기화
     */
    clear: function() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },
    
    /**
     * 사용자별 기도 키 생성
     */
    getUserPrayerKey: function(username) {
        return `${this.KEYS.PRAYERS}_${username}`;
    }
};