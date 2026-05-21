-- =====================================================
-- 창세기전 모바일 위키 - DB 스키마
-- =====================================================

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- =====================================================
-- 1. 태그
-- =====================================================

CREATE TABLE tags (
                      tag_id   INT PRIMARY KEY AUTO_INCREMENT,
                      name     VARCHAR(50) NOT NULL UNIQUE,
                      color    VARCHAR(20) DEFAULT 'gray' COMMENT 'red/blue/green/orange/yellow/purple/gray'
) COMMENT='태그 (스킬/버프/디버프 공통)';

-- =====================================================
-- 2. 버프 / 디버프
-- =====================================================

CREATE TABLE buffs (
                       buff_id       INT PRIMARY KEY AUTO_INCREMENT,
                       name          VARCHAR(100) NOT NULL,
                       description   TEXT,
                       icon_url      VARCHAR(255),
                       duration      INT COMMENT '지속 턴 (없으면 NULL)',
                       max_stack     INT DEFAULT 1 COMMENT '최대 중첩',
                       has_levels    BOOLEAN DEFAULT FALSE COMMENT '레벨 있는 버프 여부',
                       created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='버프';

CREATE TABLE buff_levels (
                             buff_level_id INT PRIMARY KEY AUTO_INCREMENT,
                             buff_id       INT NOT NULL,
                             level         INT NOT NULL,
                             effect_text   TEXT COMMENT '[수치]{색상} 포맷',
                             FOREIGN KEY (buff_id) REFERENCES buffs(buff_id) ON DELETE CASCADE,
                             UNIQUE KEY uq_buff_level (buff_id, level)
) COMMENT='버프 레벨별 효과';

CREATE TABLE buff_tag_map (
                              buff_id  INT NOT NULL,
                              tag_id   INT NOT NULL,
                              PRIMARY KEY (buff_id, tag_id),
                              FOREIGN KEY (buff_id) REFERENCES buffs(buff_id) ON DELETE CASCADE,
                              FOREIGN KEY (tag_id)  REFERENCES tags(tag_id)   ON DELETE CASCADE
) COMMENT='버프-태그 매핑';

CREATE TABLE buff_sources (
                              buff_source_id INT PRIMARY KEY AUTO_INCREMENT,
                              buff_id        INT NOT NULL,
                              source_type    ENUM('skill','class_skill','passive','ultimate','artifact','item') NOT NULL,
                              source_id      INT NOT NULL COMMENT '해당 테이블의 PK',
                              brief_desc     TEXT COMMENT '출처별 간략 설명',
                              FOREIGN KEY (buff_id) REFERENCES buffs(buff_id) ON DELETE CASCADE
) COMMENT='버프 출처';

CREATE TABLE debuffs (
                         debuff_id     INT PRIMARY KEY AUTO_INCREMENT,
                         name          VARCHAR(100) NOT NULL,
                         description   TEXT,
                         icon_url      VARCHAR(255),
                         duration      INT COMMENT '지속 턴 (없으면 NULL)',
                         max_stack     INT DEFAULT 1,
                         has_levels    BOOLEAN DEFAULT FALSE,
                         created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='디버프';

CREATE TABLE debuff_levels (
                               debuff_level_id INT PRIMARY KEY AUTO_INCREMENT,
                               debuff_id       INT NOT NULL,
                               level           INT NOT NULL,
                               effect_text     TEXT COMMENT '[수치]{색상} 포맷',
                               FOREIGN KEY (debuff_id) REFERENCES debuffs(debuff_id) ON DELETE CASCADE,
                               UNIQUE KEY uq_debuff_level (debuff_id, level)
) COMMENT='디버프 레벨별 효과';

CREATE TABLE debuff_tag_map (
                                debuff_id INT NOT NULL,
                                tag_id    INT NOT NULL,
                                PRIMARY KEY (debuff_id, tag_id),
                                FOREIGN KEY (debuff_id) REFERENCES debuffs(debuff_id) ON DELETE CASCADE,
                                FOREIGN KEY (tag_id)    REFERENCES tags(tag_id)       ON DELETE CASCADE
) COMMENT='디버프-태그 매핑';

CREATE TABLE debuff_sources (
                                debuff_source_id INT PRIMARY KEY AUTO_INCREMENT,
                                debuff_id        INT NOT NULL,
                                source_type      ENUM('skill','class_skill','passive','ultimate','artifact','item') NOT NULL,
                                source_id        INT NOT NULL,
                                brief_desc       TEXT COMMENT '출처별 간략 설명',
                                FOREIGN KEY (debuff_id) REFERENCES debuffs(debuff_id) ON DELETE CASCADE
) COMMENT='디버프 출처';

-- =====================================================
-- 3. 장비 (일반 방어구/악세사리)
-- =====================================================

CREATE TABLE equipment (
                           equipment_id  INT PRIMARY KEY AUTO_INCREMENT,
                           name          VARCHAR(100) NOT NULL,
                           type          ENUM('helmet','armor','gloves','boots','accessory') NOT NULL,
                           defense_type  ENUM('light','medium','heavy') COMMENT '방어타입 (방어구류)',
                           grade         ENUM('rare','hero','legend') NOT NULL,
                           base_stats    JSON COMMENT '기본 스탯 JSON',
                           extra_stats   TEXT COMMENT '추가 능력치 설명 텍스트',
                           set_name      VARCHAR(100) COMMENT '세트 이름',
                           set_effect_2  TEXT COMMENT '2세트 효과',
                           set_effect_4  TEXT COMMENT '4세트 효과',
                           description   TEXT,
                           icon_url      VARCHAR(255),
                           created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='장비 (방어구/악세사리)';

CREATE TABLE equipment_effects (
                                   eq_effect_id  INT PRIMARY KEY AUTO_INCREMENT,
                                   equipment_id  INT NOT NULL,
                                   effect_name   VARCHAR(100) NOT NULL COMMENT '스킬/효과 이름',
                                   effect_type   ENUM('normal','exclusive') DEFAULT 'normal' COMMENT '일반/전용 효과',
                                   base_effect   TEXT COMMENT '기본 효과 설명',
                                   icon_url      VARCHAR(255),
                                   FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE
) COMMENT='장비 효과';

CREATE TABLE equipment_effect_levels (
                                         eq_effect_level_id INT PRIMARY KEY AUTO_INCREMENT,
                                         eq_effect_id       INT NOT NULL,
                                         breakthrough_step  INT NOT NULL COMMENT '돌파단계: 1~6',
                                         effect_text        TEXT COMMENT '[수치]{색상} 포맷',
                                         FOREIGN KEY (eq_effect_id) REFERENCES equipment_effects(eq_effect_id) ON DELETE CASCADE,
                                         UNIQUE KEY uq_eq_effect_step (eq_effect_id, breakthrough_step)
) COMMENT='장비 효과 돌파단계별';

-- =====================================================
-- 4. 스킬 (클래스 스킬)
-- =====================================================

CREATE TABLE skills (
                        skill_id    INT PRIMARY KEY AUTO_INCREMENT,
                        name        VARCHAR(100) NOT NULL,
                        type        ENUM('active','passive') NOT NULL,
                        tp_cost     INT COMMENT 'TP 비용 (액티브만)',
                        range_min   INT COMMENT '사거리 최소',
                        range_max   INT COMMENT '사거리 최대',
                        area        VARCHAR(50) COMMENT '범위 (단일/직선/범위)',
                        cooldown    INT COMMENT '쿨타임 (턴)',
                        effect_text TEXT COMMENT '[수치]{색상} 포맷',
                        icon_url    VARCHAR(255),
                        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='스킬';

CREATE TABLE skill_tag_map (
                               skill_id INT NOT NULL,
                               tag_id   INT NOT NULL,
                               PRIMARY KEY (skill_id, tag_id),
                               FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
                               FOREIGN KEY (tag_id)   REFERENCES tags(tag_id)     ON DELETE CASCADE
) COMMENT='스킬-태그 매핑';

-- =====================================================
-- 5. 클래스
-- =====================================================

CREATE TABLE classes (
                         class_id        INT PRIMARY KEY AUTO_INCREMENT,
                         name            VARCHAR(100) NOT NULL,
                         tier            INT NOT NULL COMMENT '1/2/3',
                         weapon_type     VARCHAR(100) COMMENT '사용 무기 (예: 쌍수단검/관통)',
                         defense_type    ENUM('light','medium','heavy') COMMENT '방어 타입',
                         attack_range    INT COMMENT '공격 사거리',
                         move_range      INT COMMENT '이동거리',
                         base_hp         INT COMMENT '기본 체력',
                         base_attack     INT COMMENT '기본 공격력',
                         parent_class_id INT COMMENT '상위 클래스 (Tier2→Tier1)',
                         description     TEXT,
                         icon_url        VARCHAR(255),
                         passive1_name   VARCHAR(100) COMMENT '패시브 1 이름',
                         passive1_lv1    TEXT COMMENT '패시브 1 레벨1 효과',
                         passive1_lv2    TEXT COMMENT '패시브 1 레벨2 효과',
                         created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (parent_class_id) REFERENCES classes(class_id) ON DELETE SET NULL
) COMMENT='클래스';

CREATE TABLE class_skills (
                              class_skill_id INT PRIMARY KEY AUTO_INCREMENT,
                              class_id       INT NOT NULL,
                              skill_id       INT NOT NULL,
                              unlock_order   INT COMMENT '습득 순서',
                              FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
                              FOREIGN KEY (skill_id) REFERENCES skills(skill_id)  ON DELETE CASCADE
) COMMENT='클래스-스킬 매핑';

-- =====================================================
-- 6. 필살기 (발현 0/1/3/5단)
-- =====================================================

CREATE TABLE ultimate_skills (
                                 ultimate_id INT PRIMARY KEY AUTO_INCREMENT,
                                 name        VARCHAR(100) NOT NULL,
                                 icon_url    VARCHAR(255),
                                 created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='필살기';

CREATE TABLE ultimate_skill_levels (
                                       ult_level_id  INT PRIMARY KEY AUTO_INCREMENT,
                                       ultimate_id   INT NOT NULL,
                                       manifest_step INT NOT NULL COMMENT '발현단계: 0/1/3/5',
                                       tp_cost       INT,
                                       range_min     INT,
                                       range_max     INT,
                                       cooldown      INT,
                                       effect_text   TEXT COMMENT '[수치]{색상} 포맷',
                                       FOREIGN KEY (ultimate_id) REFERENCES ultimate_skills(ultimate_id) ON DELETE CASCADE,
                                       UNIQUE KEY uq_ult_step (ultimate_id, manifest_step)
) COMMENT='필살기 발현단계별 효과';

-- =====================================================
-- 7. 고유 패시브 (각성3/4/5/6 + 발현2/4/6 = 총 7단계)
-- =====================================================

CREATE TABLE character_passives (
                                    passive_id   INT PRIMARY KEY AUTO_INCREMENT,
                                    character_id INT NOT NULL COMMENT '소유 캐릭터',
                                    name         VARCHAR(100) NOT NULL,
                                    icon_url     VARCHAR(255),
                                    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='고유 패시브';

CREATE TABLE character_passive_levels (
                                          passive_level_id INT PRIMARY KEY AUTO_INCREMENT,
                                          passive_id       INT NOT NULL,
                                          unlock_type      ENUM('awaken','manifest') NOT NULL COMMENT '각성/발현 구분',
                                          unlock_step      INT NOT NULL COMMENT '각성:3/4/5/6 / 발현:2/4/6',
                                          effect_text      TEXT COMMENT '[수치]{색상} 포맷',
                                          FOREIGN KEY (passive_id) REFERENCES character_passives(passive_id) ON DELETE CASCADE,
                                          UNIQUE KEY uq_passive_unlock (passive_id, unlock_type, unlock_step)
) COMMENT='고유 패시브 단계별 효과';

-- =====================================================
-- 8. 아티팩트 (발현3/4/5/6, 최대 4개)
-- =====================================================

CREATE TABLE artifacts (
                           artifact_id  INT PRIMARY KEY AUTO_INCREMENT,
                           character_id INT NOT NULL COMMENT '소유 캐릭터',
                           name         VARCHAR(100) NOT NULL,
                           artifact_order INT NOT NULL COMMENT '순서 1~4',
                           icon_url     VARCHAR(255),
                           created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='아티팩트';

CREATE TABLE artifact_levels (
                                 artifact_level_id INT PRIMARY KEY AUTO_INCREMENT,
                                 artifact_id       INT NOT NULL,
                                 manifest_step     INT NOT NULL COMMENT '발현단계: 3/4/5/6',
                                 effect_text       TEXT COMMENT '[수치]{색상} 포맷',
                                 FOREIGN KEY (artifact_id) REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
                                 UNIQUE KEY uq_artifact_step (artifact_id, manifest_step)
) COMMENT='아티팩트 발현단계별 효과';

-- =====================================================
-- 9. 전용 무기
-- =====================================================

CREATE TABLE exclusive_weapons (
                                   weapon_id    INT PRIMARY KEY AUTO_INCREMENT,
                                   name         VARCHAR(100) NOT NULL,
                                   weapon_type  VARCHAR(100) COMMENT '무기 타입',
                                   grade        ENUM('rare','hero','legend') NOT NULL,
                                   base_stats   JSON COMMENT '기본 스탯 JSON',
                                   extra_stats  TEXT COMMENT '추가 능력치 설명 텍스트',
                                   description  TEXT,
                                   icon_url     VARCHAR(255),
                                   created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='전용 무기';

CREATE TABLE exclusive_weapon_effects (
                                          effect_id   INT PRIMARY KEY AUTO_INCREMENT,
                                          weapon_id   INT NOT NULL,
                                          effect_name VARCHAR(100) NOT NULL COMMENT '효과/스킬 이름',
                                          effect_type ENUM('normal','exclusive') DEFAULT 'normal' COMMENT '일반/전용 효과',
                                          base_effect TEXT COMMENT '기본 효과 설명',
                                          icon_url    VARCHAR(255),
                                          FOREIGN KEY (weapon_id) REFERENCES exclusive_weapons(weapon_id) ON DELETE CASCADE
) COMMENT='전용 무기 효과';

CREATE TABLE exclusive_weapon_effect_levels (
                                                ew_effect_level_id INT PRIMARY KEY AUTO_INCREMENT,
                                                effect_id          INT NOT NULL,
                                                breakthrough_step  INT NOT NULL COMMENT '돌파단계: 1~6',
                                                effect_text        TEXT COMMENT '[수치]{색상} 포맷',
                                                FOREIGN KEY (effect_id) REFERENCES exclusive_weapon_effects(effect_id) ON DELETE CASCADE,
                                                UNIQUE KEY uq_ew_step (effect_id, breakthrough_step)
) COMMENT='전용 무기 효과 돌파단계별';

-- =====================================================
-- 10. 캐릭터
-- =====================================================

CREATE TABLE characters (
                            character_id        INT PRIMARY KEY AUTO_INCREMENT,
                            name                VARCHAR(100) NOT NULL,
                            grade               ENUM('rare','hero','legend','outer') NOT NULL,
                            faction             ENUM('geysir','pendragon','independent','astania','zephyrfalcon','dagal') NOT NULL,
                            element             ENUM('light','dark','fire','crystal','nature') NOT NULL,
                            exclusive_weapon_id INT,
                            birth_year          VARCHAR(50),
                            height              VARCHAR(50),
                            cv                  VARCHAR(100) COMMENT '성우',
                            profile_text        TEXT,
                            thumbnail_url       VARCHAR(255),
                            portrait_url        VARCHAR(255),
                            full_image_url      VARCHAR(255),
                            is_published        BOOLEAN DEFAULT FALSE,
                            created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (exclusive_weapon_id) REFERENCES exclusive_weapons(weapon_id) ON DELETE SET NULL
) COMMENT='캐릭터';

CREATE TABLE character_skins (
                                 skin_id        INT PRIMARY KEY AUTO_INCREMENT,
                                 character_id   INT NOT NULL,
                                 skin_name      VARCHAR(100) NOT NULL,
                                 is_default     BOOLEAN DEFAULT FALSE,
                                 thumbnail_url  VARCHAR(255),
                                 portrait_url   VARCHAR(255),
                                 full_image_url VARCHAR(255),
                                 how_to_obtain  TEXT,
                                 release_date   DATE,
                                 FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE
) COMMENT='캐릭터 스킨';

CREATE TABLE character_stats (
                                 stat_id       INT PRIMARY KEY AUTO_INCREMENT,
                                 character_id  INT NOT NULL,
                                 hp            BIGINT,
                                 attack        INT,
                                 defense       INT,
                                 crit_rate     INT COMMENT '치명타율 (%)',
                                 crit_damage   INT COMMENT '치명타 피해 (%)',
                                 phys_pen      INT COMMENT '물리 관통',
                                 magic_pen     INT COMMENT '마법 관통',
                                 effect_resist INT COMMENT '효과 저항 (%)',
                                 FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE
) COMMENT='캐릭터 스탯 (Lv55 / 각성 6성 기준)';

-- 캐릭터-클래스 트리 연결
CREATE TABLE character_class_tree (
                                      id           INT PRIMARY KEY AUTO_INCREMENT,
                                      character_id INT NOT NULL,
                                      class_id     INT NOT NULL,
                                      order_in_tier INT COMMENT '같은 Tier 내 순서 (1부터)',
                                      FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE,
                                      FOREIGN KEY (class_id)     REFERENCES classes(class_id)        ON DELETE CASCADE,
                                      UNIQUE KEY uq_char_class (character_id, class_id)
) COMMENT='캐릭터-클래스 트리 연결';

-- =====================================================
-- 11. 발현 허브
-- =====================================================

CREATE TABLE character_manifestation (
                                         manifest_id    INT PRIMARY KEY AUTO_INCREMENT,
                                         character_id   INT NOT NULL,
                                         manifest_level INT NOT NULL COMMENT '발현단계: 3/4/5/6',
                                         ultimate_id    INT COMMENT '해당 발현단계의 필살기',
                                         passive_id     INT COMMENT '해당 발현단계의 고유패시브',
                                         artifact1_id   INT,
                                         artifact2_id   INT,
                                         artifact3_id   INT,
                                         artifact4_id   INT COMMENT '일부 캐릭터만',
                                         FOREIGN KEY (character_id)  REFERENCES characters(character_id)          ON DELETE CASCADE,
                                         FOREIGN KEY (ultimate_id)   REFERENCES ultimate_skills(ultimate_id)      ON DELETE SET NULL,
                                         FOREIGN KEY (passive_id)    REFERENCES character_passives(passive_id)    ON DELETE SET NULL,
                                         FOREIGN KEY (artifact1_id)  REFERENCES artifacts(artifact_id)            ON DELETE SET NULL,
                                         FOREIGN KEY (artifact2_id)  REFERENCES artifacts(artifact_id)            ON DELETE SET NULL,
                                         FOREIGN KEY (artifact3_id)  REFERENCES artifacts(artifact_id)            ON DELETE SET NULL,
                                         FOREIGN KEY (artifact4_id)  REFERENCES artifacts(artifact_id)            ON DELETE SET NULL,
                                         UNIQUE KEY uq_char_manifest (character_id, manifest_level)
) COMMENT='발현 허브 - 발현단계별 필살기/패시브/아티팩트 연결';

SET foreign_key_checks = 1;