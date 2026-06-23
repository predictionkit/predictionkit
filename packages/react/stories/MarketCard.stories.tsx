import type { Meta, StoryObj } from '@storybook/react';
import type { MarketStatus } from '@prediction-kit/core';
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

/** Shows the status pill styling for each normalized status. */
export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['open', 'closed', 'resolved'] as MarketStatus[]).map((status) => (
        <MarketCard key={status} market={{ ...sampleMarkets[0]!, status }} />
      ))}
    </div>
  ),
};

export const FetchedById: Story = {
  args: { marketId: 'kalshi:KXPRESPERSON-28-GNEWS' },
  decorators: [
    (Story) => (
      <PredictionKitProvider client={mockClient()}>
        <Story />
      </PredictionKitProvider>
    ),
  ],
};
