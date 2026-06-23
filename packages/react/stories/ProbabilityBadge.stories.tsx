import type { Meta, StoryObj } from '@storybook/react';
import { ProbabilityBadge } from '../src/components/ProbabilityBadge';

const meta: Meta<typeof ProbabilityBadge> = {
  title: 'Components/ProbabilityBadge',
  component: ProbabilityBadge,
  args: { probability: 0.72 },
  argTypes: {
    probability: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    precision: { control: { type: 'number', min: 0, max: 4 } },
  },
};
export default meta;

type Story = StoryObj<typeof ProbabilityBadge>;

export const Default: Story = {};

export const OneDecimal: Story = {
  args: { probability: 0.6234, precision: 1 },
};

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {[0.05, 0.25, 0.5, 0.75, 0.95].map((p) => (
        <ProbabilityBadge key={p} probability={p} />
      ))}
    </div>
  ),
};
