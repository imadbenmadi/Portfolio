-- Seed default skills.
-- Uses WHERE NOT EXISTS so it is safe to re-run: existing rows are never touched.
-- sort_order is explicit (0-based within each category) to give a logical default display order.

INSERT INTO skills (name, category, icon_name, sort_order)
SELECT v.name, v.category, v.icon_name, v.sort_order
FROM (VALUES
  -- languages  (most-used first)
  ('JavaScript',   'languages', 'SiJavascript',  0),
  ('TypeScript',   'languages', 'SiTypescript',  1),
  ('Python',       'languages', 'SiPython',      2),
  ('Go',           'languages', 'FaGolang',      3),

  -- frontend  (framework-first, then utilities)
  ('React',        'frontend',  'SiReact',       0),
  ('Next.js',      'frontend',  'SiNextdotjs',   1),
  ('Tailwind CSS', 'frontend',  'SiTailwindcss', 2),
  ('Chakra UI',    'frontend',  'SiChakraui',    3),
  ('HTML5',        'frontend',  'SiHtml5',       4),
  ('CSS3',         'frontend',  'SiCss3',        5),
  ('Sass',         'frontend',  'SiSass',        6),

  -- backend  (Node ecosystem first, then Python, then JVM/.NET)
  ('Node.js',      'backend',   'SiNodedotjs',   0),
  ('Express',      'backend',   'SiExpress',     1),
  ('NestJS',       'backend',   'SiNestjs',      2),
  ('FastAPI',      'backend',   'SiFastapi',     3),
  ('Django',       'backend',   'SiDjango',      4),
  ('Flask',        'backend',   'SiFlask',       5),
  ('Spring',       'backend',   'SiSpring',      6),
  ('.NET',         'backend',   'SiDotnet',      7),

  -- databases  (relational first, then document, then cache)
  ('PostgreSQL',   'databases', 'SiPostgresql',  0),
  ('MySQL',        'databases', 'SiMysql',       1),
  ('MongoDB',      'databases', 'SiMongodb',     2),
  ('Redis',        'databases', 'SiRedis',       3),

  -- devops
  ('Docker',       'devops',    'SiDocker',      0),
  ('Kubernetes',   'devops',    'SiKubernetes',  1),
  ('Terraform',    'devops',    'SiTerraform',   2),

  -- cloud
  ('AWS',          'cloud',     'SiAmazonaws',   0),
  ('GCP',          'cloud',     'SiGooglecloud', 1),
  ('Azure',        'cloud',     'SiMicrosoftazure', 2),

  -- tools
  ('Git',          'tools',     'SiGit',         0),
  ('GitHub',       'tools',     'SiGithub',      1),
  ('Linux',        'tools',     'SiLinux',       2),

  -- data engineering
  ('Pandas',       'data',      'SiPandas',      0),
  ('NumPy',        'data',      'SiNumpy',       1),
  ('Jupyter',      'data',      'SiJupyter',     2),
  ('Airflow',      'data',      'SiApacheairflow', 3),
  ('Kafka',        'data',      'SiApachekafka', 4),
  ('Databricks',   'data',      'SiDatabricks',  5),

  -- ml / ai
  ('scikit-learn', 'ml',        'SiScikitlearn', 0),
  ('PyTorch',      'ml',        'SiPytorch',     1),
  ('TensorFlow',   'ml',        'SiTensorflow',  2)
) AS v (name, category, icon_name, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM skills s
  WHERE LOWER(s.name) = LOWER(v.name)
    AND s.category    = v.category
);
