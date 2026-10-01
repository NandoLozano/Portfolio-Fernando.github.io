import type { Project } from '../../src/data/projects';

// Synthetic fixtures, never professional claims. Imported ONLY by isolated tests.
export const realFixtures: Project[] = [
  {
    id: 'fixture-private', status: 'real', icon: 'database', tone: 'blue',
    content: {
      es: { slug: 'fixture-privado', title: 'Fixture sin repositorio', summary: 'Caso sintético para pruebas.', results: [{ kind: 'qualitative', text: 'Resultado cualitativo de prueba, sin métrica.' }] },
      en: { slug: 'fixture-private', title: 'Fixture without repository', summary: 'Synthetic test case.', results: [{ kind: 'qualitative', text: 'Qualitative test outcome without a metric.' }] },
    },
  },
  {
    id: 'fixture-demo', status: 'real', icon: 'window', tone: 'lavender', stack: ['Fixture stack'],
    repository: 'https://example.com/repository', demo: 'https://example.com/demo?lang=en&mode=test#view',
    content: {
      es: {
        slug: 'fixture-demostracion', title: 'Fixture con demo', summary: 'Datos sintéticos; no describen trabajo de Fernando.',
        category: 'Pruebas', role: 'Contribución de prueba', problem: 'Problema de prueba.', solution: 'Solución de prueba.',
        flow: ['Entrada de prueba', 'Salida de prueba'], decisions: [{ title: 'Decisión de prueba', text: 'Motivo de prueba.' }],
        results: [{ kind: 'metric', value: '12', text: 'Casos sintéticos comprobados.', basis: 'Medición ficticia exclusiva del fixture; no es un resultado profesional.', confirmed: true }],
        screenshots: [{ src: '/images/projects/fixture.png', alt: 'Imagen sintética para probar una captura', width: 960, height: 540, caption: 'Captura de prueba, sin datos reales.' }],
      },
      en: {
        slug: 'fixture-demo', title: 'Fixture with demo', summary: 'Synthetic data; does not describe Fernando’s work.',
        category: 'Testing', role: 'Test contribution', problem: 'Test problem.', solution: 'Test solution.',
        flow: ['Test input', 'Test output'], decisions: [{ title: 'Test decision', text: 'Test reasoning.' }],
        results: [{ kind: 'metric', value: '12', text: 'Synthetic cases checked.', basis: 'Fictional measurement for this fixture only; not a professional result.', confirmed: true }],
        screenshots: [{ src: '/images/projects/fixture.png', alt: 'Synthetic image to test a screenshot', width: 960, height: 540 }],
      },
    },
  },
  {
    id: 'fixture-empty', status: 'real', icon: 'workflow', tone: 'sand', stack: [],
    repository: 'javascript:alert(1)', demo: 'https://user:password@example.com',
    content: {
      es: { slug: 'fixture-vacio', title: 'Fixture sin campos opcionales', summary: 'Prueba de campos vacíos y enlaces rechazados.', role: ' ', problem: '', solution: ' ', flow: [], decisions: [], validation: [], results: [], screenshots: [] },
      en: { slug: 'fixture-empty', title: 'Fixture without optional fields', summary: 'Test of empty fields and rejected links.', role: ' ', problem: '', solution: ' ', flow: [], decisions: [], validation: [], results: [], screenshots: [] },
    },
  },
];
