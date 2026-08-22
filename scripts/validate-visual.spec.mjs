import assert from 'node:assert/strict';
import test from 'node:test';

import { validateVisual } from './validate-visual.mjs';

const visual = {
  title: 'Request flow',
  layout: 'sequence',
  groups: [{
    title: 'Control plane',
    blocks: [
      { id: 'api-server', title: 'API server', summary: 'Accepts the request.', detail: 'Authenticates and validates the incoming request before persistence.', example: 'A deployment PATCH passes RBAC checks.' },
      { id: 'etcd', title: 'etcd', summary: 'Stores desired state.', detail: 'Persists the accepted desired state for controllers to observe.', example: 'A new revision triggers a controller watch.' },
    ],
  }],
};

test('accepts a valid visual', () => assert.doesNotThrow(() => validateVisual(visual)));

test('rejects duplicate block IDs', () => {
  const duplicate = structuredClone(visual);
  duplicate.groups[0].blocks[1].id = 'api-server';
  assert.throws(() => validateVisual(duplicate), /block IDs must be unique/);
});

test('rejects visuals outside the total block limit', () => {
  const oneBlock = structuredClone(visual);
  oneBlock.groups[0].blocks.pop();
  assert.throws(() => validateVisual(oneBlock), /2 to 16 blocks/);
});
