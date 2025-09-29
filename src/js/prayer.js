/**
 * 기도 데이터 관리
 */

const Prayers = {
    prayers: [],
    currentFilter: 'all',
    editingId: null,
    
    /**
     * 초기화
     */
    init: function() {
        this.loadPrayers();
        this.bindEvents();
        this.render();
    },
    
    /**
     * 이벤트 바인딩
     */
    bindEvents: function() {
        // 기도 추가
        document.getElementById('addBtn').addEventListener('click', () => this.addPrayer());
        document.getElementById('prayerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPrayer();
        });
        
        // 필터
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    },
    
    /**
     * 기도 추가
     */
    addPrayer: function() {
        const input = document.getElementById('prayerInput');
        const typeSelect = document.getElementById('prayerType');
        const text = input.value.trim();
        
        if (!text) {
            Utils.showAlert('기도 제목을 입력해주세요');
            return;
        }
        
        const prayer = {
            id: Utils.generateId(),
            text: text,
            type: typeSelect.value,
            status: 'W',
            createdAt: new Date().toISOString(),
            userId: Auth.getCurrentUser()
        };
        
        this.prayers.unshift(prayer);
        this.savePrayers();
        this.render();
        this.updateStats();
        
        // 입력 초기화
        input.value = '';
        input.focus();
    },
    
    /**
     * 기도 수정
     */
    editPrayer: function(id) {
        this.editingId = id;
        this.render();
        
        // 포커스 설정
        setTimeout(() => {
            const input = document.getElementById(`edit-${id}`);
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    },
    
    /**
     * 수정 저장
     */
    saveEdit: function(id) {
        const input = document.getElementById(`edit-${id}`);
        const newText = input.value.trim();
        
        if (!newText) {
            Utils.showAlert('기도 제목을 입력해주세요');
            return;
        }
        
        const prayer = this.prayers.find(p => p.id === id);
        if (prayer) {
            prayer.text = newText;
            prayer.updatedAt = new Date().toISOString();
            this.savePrayers();
        }
        
        this.editingId = null;
        this.render();
    },
    
    /**
     * 수정 취소
     */
    cancelEdit: function() {
        this.editingId = null;
        this.render();
    },
    
    /**
     * 기도 삭제
     */
    deletePrayer: function(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            this.prayers = this.prayers.filter(p => p.id !== id);
            this.savePrayers();
            this.render();
            this.updateStats();
        }
    },
    
    /**
     * 상태 변경
     */
    updateStatus: function(id, status) {
        const prayer = this.prayers.find(p => p.id === id);
        if (prayer) {
            prayer.status = status;
            if (status === 'Y') {
                prayer.answeredAt = new Date().toISOString();
            }
            this.savePrayers();
            this.render();
        }
    },
    
    /**
     * 상태 토글 (클릭시)
     */
    toggleStatus: function(id) {
        const prayer = this.prayers.find(p => p.id === id);
        if (prayer) {
            const statusCycle = { 'W': 'Y', 'Y': 'N', 'N': 'W' };
            prayer.status = statusCycle[prayer.status] || 'W';
            this.savePrayers();
            this.render();
        }
    },
    
    /**
     * 필터 설정
     */
    setFilter: function(filter) {
        this.currentFilter = filter;
        
        // 필터 버튼 업데이트
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    },
    
    /**
     * 기도 목록 렌더링
     */
    render: function() {
        const container = document.getElementById('prayerList');
        let filtered = this.prayers;
        
        // 필터링
        if (this.currentFilter !== 'all') {
            filtered = this.prayers.filter(p => p.status === this.currentFilter);
        }
        
        // 빈 상태
        if (filtered.length === 0) {
            container.innerHTML = Templates.emptyState();
            return;
        }
        
        // 기도 목록 렌더링
        container.innerHTML = filtered.map(prayer => {
            if (this.editingId === prayer.id) {
                return Templates.prayerEditItem(prayer);
            }
            return Templates.prayerItem(prayer);
        }).join('');
        
        // 이벤트 리스너 추가
        this.attachItemEvents();
    },
    
    /**
     * 아이템 이벤트 연결
     */
    attachItemEvents: function() {
        // 각 기도 아이템에 이벤트 추가
        document.querySelectorAll('.prayer-item').forEach(item => {
            const id = item.dataset.id;
            if (!id) return;
            
            // 클릭 이벤트 (상태 토글)
            if (!item.classList.contains('editing')) {
                item.addEventListener('click', () => this.toggleStatus(id));
            }
        });
    },
    
    /**
     * 통계 업데이트
     */
    updateStats: function() {
        const stats = {
            supplication: 0,
            thanksgiving: 0,
            adoration: 0,
            confession: 0
        };
        
        this.prayers.forEach(prayer => {
            if (stats.hasOwnProperty(prayer.type)) {
                stats[prayer.type]++;
            }
        });
        
        // 통계 HTML 업데이트
        const statsHtml = Templates.statsSection(stats);
        document.getElementById('stats').innerHTML = statsHtml;
    },
    
    /**
     * 저장
     */
    savePrayers: function() {
        const key = Storage.getUserPrayerKey(Auth.getCurrentUser());
        Storage.save(key, this.prayers);
    },
    
    /**
     * 불러오기
     */
    loadPrayers: function() {
        const key = Storage.getUserPrayerKey(Auth.getCurrentUser());
        this.prayers = Storage.load(key) || [];
        
        // 첫 사용자면 샘플 데이터 추가
        if (this.prayers.length === 0 && Auth.isLoggedIn()) {
            this.prayers = [{
                id: Utils.generateId(),
                text: "오늘도 지각하지 않게 해주세요",
                type: "supplication",
                status: "W",
                createdAt: new Date().toISOString(),
                userId: Auth.getCurrentUser()
            }];
            this.savePrayers();
        }
    }
};

// 전역 함수로 노출 (HTML onclick 이벤트용)
window.Prayers = Prayers;