import type { Meta, StoryObj } from '@storybook/react';
import { TrendingMarkets } from '../src/components/TrendingMarkets';
import { PredictionKitProvider } from '../src/context';
import { mockClient } from './fixtures';

const meta: Meta<typeof TrendingMarkets> = {
  title: 'Components/TrendingMarkets',
  component: TrendingMarkets,
  decorators: [
    (Story) => (
      <PredictionKitProvider client={mockClient()}>
        <Story />
      </PredictionKitProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TrendingMarkets>;

export const Default: Story = {
  args: { limit: 5 },
};
