import type { Meta, StoryObj } from '@storybook/react';
import { MarketCard } from '../src/components/MarketCard';
import { PredictionKitProvider } from '../src/context';
import { mockClient, sampleMarkets } from './fixtures';

const meta: Meta<typeof MarketCard> = {
  title: 'Components/MarketCard',
  component: MarketCard,
};
export default meta;

type Story = StoryObj<typeof MarketCard>;

export const FromMarketObject: Story = {
  args: { market: sampleMarkets[0] },
};

export const ClosedMarket: Story = {
  args: { market: sampleMarkets[2] },
};

export const FetchedById: Story = {
  args: { marketId: 'kalshi:KXHIGHNY-26MAR15-T75' },
  decorators: [
    (Story) => (
      <PredictionKitProvider client={mockClient()}>
        <Story />
      </PredictionKitProvider>
    ),
  ],
};
