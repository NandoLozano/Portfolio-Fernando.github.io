import type { Language } from '../lib/i18n';
export type ProjectIcon = 'workflow' | 'window' | 'database';
export interface ProjectTranslation {
  slug: string; title: string; category: string; summary: string;
  problem: string; solution: string; role: string;
  decisions: { title: string; text: string }[];
  flow: [string, string, string]; validation: string[];
}
export interface Project {
  id: string; icon: ProjectIcon; tone: 'blue' | 'lavender' | 'sand'; sample: true;
  stack: string[]; content: Record<Language, ProjectTranslation>;
}
export const projects: Project[] = [
  {
    id: 'automation', icon: 'workflow', tone: 'blue', sample: true, stack: ['Python', 'FastAPI', 'SQLite'],
    content: {
      es: {
        slug: 'automatizacion', title: 'Automatización', category: 'Flujos de trabajo',
        summary: 'Menos tareas repetitivas. Más tiempo para lo que importa.',
        problem: 'Imagina un equipo que copia datos entre hojas de cálculo cada semana. Las tareas manuales interrumpen su trabajo y es difícil saber en qué punto se ha producido un error.',
        solution: 'La propuesta es un flujo que recibe un archivo, valida sus datos y prepara un resultado revisable. Los casos inesperados se detienen para que una persona pueda decidir cómo continuar.',
        role: 'Análisis del proceso, diseño del flujo e implementación de una prueba de concepto.',
        flow: ['Recibir datos', 'Validar y transformar', 'Revisar resultado'],
        decisions: [
          { title: 'Validar antes de actuar', text: 'Separar los datos incompletos antes de transformar nada evita propagar errores.' },
          { title: 'Mantener el control humano', text: 'El resultado se revisaría antes de integrarlo en otros sistemas.' },
        ],
        validation: ['Comparar el tiempo del proceso manual con el de la propuesta.', 'Comprobar que un archivo repetido no genera resultados duplicados.', 'Evaluar si los mensajes de error permiten corregir el origen del problema.'],
      },
      en: {
        slug: 'automation', title: 'Automation', category: 'Workflows',
        summary: 'Fewer repetitive tasks. More time for what matters.',
        problem: 'Imagine a team copying data between spreadsheets every week. Manual tasks interrupt their work, and it is hard to trace where an error occurred.',
        solution: 'The proposal is a workflow that receives a file, validates its data and prepares a reviewable output. Unexpected cases stop for a person to decide what happens next.',
        role: 'Process analysis, workflow design and implementation of a proof of concept.',
        flow: ['Receive data', 'Validate and transform', 'Review output'],
        decisions: [
          { title: 'Validate before acting', text: 'Separating incomplete data before any transformation prevents errors from spreading.' },
          { title: 'Keep people in control', text: 'A person would review the output before it is integrated into other systems.' },
        ],
        validation: ['Compare the manual process time with the proposed workflow.', 'Check that repeated files do not create duplicate outputs.', 'Assess whether error messages help resolve the original problem.'],
      },
    },
  },
  {
    id: 'web-product', icon: 'window', tone: 'lavender', sample: true, stack: ['Astro', 'TypeScript', 'Tailwind CSS'],
    content: {
      es: {
        slug: 'producto-web', title: 'Producto web', category: 'De idea a producto',
        summary: 'Una idea clara merece una experiencia igual de clara.',
        problem: 'Una pequeña iniciativa necesita explicar qué ofrece. La información está dispersa y quienes llegan desde el móvil no encuentran un recorrido sencillo.',
        solution: 'Un sitio estático que organiza la información en pocas páginas, prioriza la lectura y permite acceder a cada servicio mediante una dirección propia.',
        role: 'Arquitectura de información, diseño de interfaz y desarrollo de una propuesta responsive.',
        flow: ['Contenido estructurado', 'Páginas estáticas', 'Lectura accesible'],
        decisions: [
          { title: 'El contenido primero', text: 'La jerarquía responde a las preguntas de quien visita la web.' },
          { title: 'Enviar solo lo necesario', text: 'Generar HTML estático reduce la carga y simplifica el mantenimiento.' },
        ],
        validation: ['Observar si una persona encuentra la información sin ayuda.', 'Revisar lectura, teclado y adaptación a distintos tamaños.', 'Medir el rendimiento con contenido y recursos definitivos.'],
      },
      en: {
        slug: 'web-product', title: 'Web product', category: 'From idea to product',
        summary: 'A clear idea deserves an equally clear experience.',
        problem: 'A small initiative needs to explain its offering. Information is scattered, and mobile visitors cannot find a straightforward path through it.',
        solution: 'A static site that organises information into a few pages, prioritises reading and gives every service its own address.',
        role: 'Information architecture, interface design and development of a responsive proposal.',
        flow: ['Structured content', 'Static pages', 'Accessible reading'],
        decisions: [
          { title: 'Content comes first', text: 'The hierarchy answers the questions visitors bring to the website.' },
          { title: 'Send only what is needed', text: 'Generating static HTML reduces load and simplifies maintenance.' },
        ],
        validation: ['Observe whether a person finds information without help.', 'Review reading, keyboard access and different screen sizes.', 'Measure performance with final content and assets.'],
      },
    },
  },
  {
    id: 'backend', icon: 'database', tone: 'sand', sample: true, stack: ['TypeScript', 'Node.js', 'PostgreSQL'],
    content: {
      es: {
        slug: 'backend', title: 'Backend', category: 'Sistemas y datos',
        summary: 'Una base ordenada para que todo lo demás funcione.',
        problem: 'Un inventario de ejemplo se consulta desde varias herramientas. Cada una interpreta los datos de forma distinta y no existe una fuente común de información.',
        solution: 'Una API conceptual con un modelo de datos compartido, validación de entradas y operaciones explícitas. Las integraciones consumirían el mismo contrato.',
        role: 'Modelado de datos, diseño del contrato de API y estrategia de pruebas.',
        flow: ['Petición validada', 'Reglas del dominio', 'Datos consistentes'],
        decisions: [
          { title: 'Un contrato comprensible', text: 'Definir las entradas y respuestas permite desarrollar integraciones de forma independiente.' },
          { title: 'Consistencia desde el modelo', text: 'Las restricciones en la base de datos protegerían las reglas compartidas.' },
        ],
        validation: ['Verificar las operaciones con entradas válidas e inválidas.', 'Probar conflictos entre actualizaciones simultáneas.', 'Definir controles de acceso antes de conectar sistemas reales.'],
      },
      en: {
        slug: 'backend', title: 'Backend', category: 'Systems and data',
        summary: 'An organised foundation that keeps everything working.',
        problem: 'Several tools query a sample inventory. Each interprets the data differently, and there is no shared source of information.',
        solution: 'A conceptual API with a shared data model, input validation and explicit operations. Integrations would use the same contract.',
        role: 'Data modelling, API contract design and test strategy.',
        flow: ['Validated request', 'Domain rules', 'Consistent data'],
        decisions: [
          { title: 'A clear contract', text: 'Defined inputs and responses allow integrations to be developed independently.' },
          { title: 'Consistency by design', text: 'Database constraints would protect the shared rules.' },
        ],
        validation: ['Verify operations with valid and invalid inputs.', 'Test conflicts between concurrent updates.', 'Define access controls before connecting real systems.'],
      },
    },
  },
];
