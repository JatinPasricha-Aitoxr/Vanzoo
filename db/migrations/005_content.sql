-- Editable overlays on the code-defined catalogue (services, products, areas, tariffs, stores, FAQs).
-- `data` holds only the fields an editor changed; everything else keeps coming from the code.
CREATE TABLE IF NOT EXISTS cms_content (
  type       VARCHAR(32)  NOT NULL,
  k          VARCHAR(190) NOT NULL,
  data       JSON NOT NULL,
  updated_by VARCHAR(64) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (type, k)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
