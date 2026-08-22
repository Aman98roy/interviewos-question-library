const layouts = new Set(['sequence', 'comparison']);

export function validateVisual(visual, name = 'visual') {
  assert(visual && typeof visual === 'object' && !Array.isArray(visual), `${name} must be an object`);
  boundedText(visual.title, `${name} title`, 3, 120);
  if (visual.description !== undefined) boundedText(visual.description, `${name} description`, 3, 300);
  assert(layouts.has(visual.layout), `${name} has an invalid layout`);
  assert(Array.isArray(visual.groups) && visual.groups.length >= 1 && visual.groups.length <= 5, `${name} must have 1 to 5 groups`);

  const ids = [];
  let blockCount = 0;
  for (const [groupIndex, group] of visual.groups.entries()) {
    boundedText(group?.title, `${name} group ${groupIndex + 1} title`, 2, 80);
    assert(Array.isArray(group?.blocks) && group.blocks.length >= 1 && group.blocks.length <= 16, `${name} group ${groupIndex + 1} must have 1 to 16 blocks`);
    for (const [blockIndex, block] of group.blocks.entries()) {
      const blockName = `${name} block ${blockIndex + 1}`;
      assert(typeof block?.id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(block.id), `${blockName} has an invalid id`);
      ids.push(block.id);
      boundedText(block.title, `${blockName} title`, 1, 80);
      boundedText(block.summary, `${blockName} summary`, 3, 200);
      boundedText(block.detail, `${blockName} detail`, 20, 1_000);
      boundedText(block.example, `${blockName} example`, 10, 1_000);
      if (block.callout !== undefined) boundedText(block.callout, `${blockName} callout`, 1, 120);
      blockCount += 1;
    }
  }
  assert(blockCount >= 2 && blockCount <= 16, `${name} must contain 2 to 16 blocks`);
  assert(new Set(ids).size === ids.length, `${name} block IDs must be unique`);
}

function boundedText(value, name, minimum, maximum) {
  assert(typeof value === 'string' && value.trim().length >= minimum && value.trim().length <= maximum, `${name} must contain ${minimum} to ${maximum} characters`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
