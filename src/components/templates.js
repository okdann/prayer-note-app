/**
 * HTML 템플릿 생성
 */

const Templates = {
    /**
     * 기도 아이템 템플릿
     */
    prayerItem: function(prayer) {
        const typeNames = {
            'supplication': '간구',
            'thanksgiving': '감사',
            'adoration': '찬양',
            'confession': '자백'
        };
        
        return `
            <div class="prayer-item" data-id="${prayer.id}">
                <div class="prayer-content">
                    <span class="prayer-type-badge ${prayer.type}">
                        ${typeNames[prayer.type] || '간구'}
                    </span>
                    <div class="prayer-main">
                        <div class="prayer-text">${Utils.escapeHtml(prayer.text)}</div>
                        <div class="prayer-meta">
                            <span class="prayer-date">${Utils.formatDate(prayer.createdAt)}</span>
                            <div class="status-group" onclick="event.stopPropagation()">
                                <button class="status-btn ${prayer.status === 'W' ? 'active-W' : ''}" 
                                        onclick="Prayers.updateStatus('${prayer.id}', 'W')">W</button>
                                <button class="status-btn ${prayer.status === 'Y' ? 'active-Y' : ''}" 
                                        onclick="Prayers.updateStatus('${prayer.id}', 'Y')">Y</button>
                                <button class="status-btn ${prayer.status === 'N' ? 'active-N' : ''}" 
                                        onclick="Prayers.updateStatus('${prayer.id}', 'N')">N</button>
                            </div>
                            <div class="prayer-actions" onclick="event.stopPropagation()">
                                <a class="action-link" onclick="Prayers.editPrayer('${prayer.id}')">수정</a>
                                <a class="action-link danger" onclick="Prayers.deletePrayer('${prayer.id}')">삭제</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * 기도 수정 템플릿
     */
    prayerEditItem: function(prayer) {
        const typeNames = {
            'supplication': '간구',
            'thanksgiving': '감사',
            'adoration': '찬양',
            'confession': '자백'
        };
        
        return `
            <div class="prayer-item editing" data-id="${prayer.id}">
                <div class="prayer-content">
                    <span class="prayer-type-badge ${prayer.type}">
                        ${typeNames[prayer.type] || '간구'}
                    </span>
                    <div class="prayer-main">
                        <input type="text" 
                               id="edit-${prayer.id}"
                               class="edit-input" 
                               value="${Utils.escapeHtml(prayer.text)}"
                               onkeypress="if(event.key==='Enter') Prayers.saveEdit('${prayer.id}')"
                               onkeydown="if(event.key==='Escape') Prayers.cancelEdit()">
                        <div class="edit-actions">
                            <button class="btn btn-success" onclick="Prayers.saveEdit('${prayer.id}')">저장</button>
                            <button class="btn btn-secondary" onclick="Prayers.cancelEdit()">취소</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * 빈 상태 템플릿
     */
    emptyState: function() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🙏</div>
                <p>아직 기도가 없습니다</p>
                <p class="text-muted">위에서 첫 기도를 추가해보세요</p>
            </div>
        `;
    },
    
    /**
     * 통계 섹션 템플릿
     */
    statsSection: function(stats) {
        return `
            <div class="stat-item">
                <span class="stat-label">간구</span>
                <span class="stat-count">${stats.supplication || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">감사</span>
                <span class="stat-count">${stats.thanksgiving || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">찬양</span>
                <span class="stat-count">${stats.adoration || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">자백</span>
                <span class="stat-count">${stats.confession || 0}</span>
            </div>
        `;
    }
};