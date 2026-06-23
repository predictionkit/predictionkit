import type { Meta, StoryObj } from '@storybook/react';
import { MarketList } from '../src/components/MarketList';
import { PredictionKitProvider } from '../src/context';
import { mockClient, sampleMarkets } from './fixtures';

const meta: Meta<typeof MarketList> = {
  title: 'Components/MarketList',
  component: MarketList,
};
export default meta;

type Story = StoryObj<typeof MarketList>;

export const FromMarkets: Story = {
  args: { markets: sampleMarkets },
};

export const Empty: Story = {
  args: { markets: [], emptyMessage: 'Nothing here yet.' },
};

export const Fetched: Story = {
  args: { options: { limit: 2 } },
  decorators: [
    (Story) => (
      <PredictionKitProvider client={mockClient()}>
        <Story />
      </PredictionKitProvider>
    ),
  ],
};
