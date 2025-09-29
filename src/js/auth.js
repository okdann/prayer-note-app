/**
 * 사용자 인증 관리
 */

const Auth = {
    currentUser: null,
    
    /**
     * 로그인 (현재는 단순 이름 입력)
     */
    login: function(username) {
        if (!username || username.trim() === '') {
            return { success: false, message: '이름을 입력해주세요' };
        }
        
        this.currentUser = username.trim();
        Storage.save(Storage.KEYS.USER, this.currentUser);
        
        return { success: true, user: this.currentUser };
    },
    
    /**
     * 로그아웃
     */
    logout: function() {
        this.currentUser = null;
        Storage.remove(Storage.KEYS.USER);
        return true;
    },
    
    /**
     * 현재 사용자 확인
     */
    getCurrentUser: function() {
        if (!this.currentUser) {
            this.currentUser = Storage.load(Storage.KEYS.USER);
        }
        return this.currentUser;
    },
    
    /**
     * 로그인 상태 확인
     */
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    }
};