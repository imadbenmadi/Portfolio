import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiAmazonwebservices,
  SiGooglecloud,
  SiMicrosoftazure,
  SiGithub,
  SiGit,
  SiLinux,
  SiTailwindcss,
  SiChakraui,
  SiHtml5,
  SiCss3,
  SiSass,
  SiExpress,
  SiNestjs,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiSpring,
  SiDotnet,
  SiTerraform,
  SiApacheairflow,
  SiApachekafka,
  SiDatabricks,
  SiPandas,
  SiNumpy,
  SiJupyter,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn
} from 'react-icons/si'
import { FaGolang } from 'react-icons/fa6'

export const SKILL_CATEGORIES = [
  { value: 'languages', label: 'Programming Languages', color: 'yellow' },
  { value: 'frontend', label: 'Frontend', color: 'blue' },
  { value: 'backend', label: 'Backend', color: 'green' },
  { value: 'databases', label: 'Databases', color: 'orange' },
  // Backward-compatible category used by existing data
  { value: 'hosting', label: 'Hosting', color: 'purple' },
  { value: 'cloud', label: 'Cloud', color: 'cyan' },
  { value: 'devops', label: 'DevOps', color: 'purple' },
  { value: 'testing', label: 'Testing', color: 'red' },
  { value: 'security', label: 'Security', color: 'red' },
  { value: 'data', label: 'Data Engineering', color: 'teal' },
  { value: 'ml', label: 'AI / ML', color: 'pink' },
  { value: 'tools', label: 'Tools', color: 'gray' },
  { value: 'other', label: 'Other', color: 'gray' }
]

export const CATEGORY_BY_VALUE = Object.fromEntries(
  SKILL_CATEGORIES.map(c => [c.value, c])
)

// A curated built-in icon set (stored as `icon_name` in DB)
export const BUILTIN_SKILL_ICONS = [
  { value: 'SiJavascript', label: 'JavaScript', Icon: SiJavascript },
  { value: 'SiTypescript', label: 'TypeScript', Icon: SiTypescript },
  { value: 'SiPython', label: 'Python', Icon: SiPython },
  { value: 'FaGolang', label: 'Go', Icon: FaGolang },
  { value: 'SiHtml5', label: 'HTML5', Icon: SiHtml5 },
  { value: 'SiCss3', label: 'CSS3', Icon: SiCss3 },
  { value: 'SiSass', label: 'Sass', Icon: SiSass },
  { value: 'SiReact', label: 'React', Icon: SiReact },
  { value: 'SiNextdotjs', label: 'Next.js', Icon: SiNextdotjs },
  { value: 'SiTailwindcss', label: 'Tailwind CSS', Icon: SiTailwindcss },
  { value: 'SiChakraui', label: 'Chakra UI', Icon: SiChakraui },
  { value: 'SiNodedotjs', label: 'Node.js', Icon: SiNodedotjs },
  { value: 'SiExpress', label: 'Express', Icon: SiExpress },
  { value: 'SiNestjs', label: 'NestJS', Icon: SiNestjs },
  { value: 'SiDjango', label: 'Django', Icon: SiDjango },
  { value: 'SiFlask', label: 'Flask', Icon: SiFlask },
  { value: 'SiFastapi', label: 'FastAPI', Icon: SiFastapi },
  { value: 'SiSpring', label: 'Spring', Icon: SiSpring },
  { value: 'SiDotnet', label: '.NET', Icon: SiDotnet },
  { value: 'SiPostgresql', label: 'PostgreSQL', Icon: SiPostgresql },
  { value: 'SiMysql', label: 'MySQL', Icon: SiMysql },
  { value: 'SiMongodb', label: 'MongoDB', Icon: SiMongodb },
  { value: 'SiRedis', label: 'Redis', Icon: SiRedis },
  { value: 'SiDocker', label: 'Docker', Icon: SiDocker },
  { value: 'SiKubernetes', label: 'Kubernetes', Icon: SiKubernetes },
  { value: 'SiTerraform', label: 'Terraform', Icon: SiTerraform },
  { value: 'SiAmazonwebservices', label: 'AWS', Icon: SiAmazonwebservices },
  { value: 'SiGooglecloud', label: 'GCP', Icon: SiGooglecloud },
  { value: 'SiMicrosoftazure', label: 'Azure', Icon: SiMicrosoftazure },
  { value: 'SiLinux', label: 'Linux', Icon: SiLinux },
  { value: 'SiGit', label: 'Git', Icon: SiGit },
  { value: 'SiGithub', label: 'GitHub', Icon: SiGithub },
  { value: 'SiApacheairflow', label: 'Airflow', Icon: SiApacheairflow },
  { value: 'SiApachekafka', label: 'Kafka', Icon: SiApachekafka },
  { value: 'SiDatabricks', label: 'Databricks', Icon: SiDatabricks },
  { value: 'SiPandas', label: 'Pandas', Icon: SiPandas },
  { value: 'SiNumpy', label: 'NumPy', Icon: SiNumpy },
  { value: 'SiJupyter', label: 'Jupyter', Icon: SiJupyter },
  { value: 'SiScikitlearn', label: 'scikit-learn', Icon: SiScikitlearn },
  { value: 'SiPytorch', label: 'PyTorch', Icon: SiPytorch },
  { value: 'SiTensorflow', label: 'TensorFlow', Icon: SiTensorflow }
]

export const BUILTIN_ICON_BY_VALUE = Object.fromEntries(
  BUILTIN_SKILL_ICONS.map(i => [i.value, i])
)
