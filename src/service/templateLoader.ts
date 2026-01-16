import fs from 'fs';
import path from 'path';
import { TEMPLATE_REGISTRY } from '../templates_dir';
import type { Category } from '../templates_dir';

export function getTemplateFile(
  category: Category,
  templateId: string
): string {
  const templates = TEMPLATE_REGISTRY[category];

  const template = templates.find(t => t.id === Number(templateId));

  if (!template) {
    throw new Error(
      `Template "${templateId}" not found in category "${category}"`
    );
  }

  const filePath = path.join(
    process.cwd(),
    'src',
    'templates_dir',
    category,
    template.file
  );

  return fs.readFileSync(filePath, 'utf8');
}

export function getAllTemplatesInCategory(
  category: Category
): Array<{ id: number; title: string; file: string }> {
  return TEMPLATE_REGISTRY[category];
}