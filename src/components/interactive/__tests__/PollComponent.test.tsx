import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PollComponent } from '../PollComponent';

describe('PollComponent', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    it('renders poll question and options', () => {
        const pollData = {
            question: 'What is your favorite color?',
            options: [
                { id: 'opt1', text: 'Red', votes: 0 },
                { id: 'opt2', text: 'Blue', votes: 0 },
                { id: 'opt3', text: 'Green', votes: 0 },
            ],
        };

        render(<PollComponent pollData={pollData} />);

        expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
        expect(screen.getByText('Red')).toBeInTheDocument();
        expect(screen.getByText('Blue')).toBeInTheDocument();
        expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('allows single selection and submission', async () => {
        const pollData = {
            question: 'Pick one',
            options: [
                { id: 'opt1', text: 'Option 1', votes: 0 },
                { id: 'opt2', text: 'Option 2', votes: 0 },
            ],
            allowMultiple: false,
        };

        render(<PollComponent pollData={pollData} />);

        // Click on first option
        const option1Button = screen.getByText('Option 1').closest('button');
        fireEvent.click(option1Button!);

        // Submit button should appear
        const submitButton = screen.getByText(/Submit Vote/i);
        expect(submitButton).toBeInTheDocument();

        // Submit the vote
        fireEvent.click(submitButton);

        // Results should be shown
        await waitFor(() => {
            expect(screen.getByText(/Results/i)).toBeInTheDocument();
        });
    });

    it('allows multiple selections when enabled', async () => {
        const pollData = {
            question: 'Pick multiple',
            options: [
                { id: 'opt1', text: 'Option 1', votes: 0 },
                { id: 'opt2', text: 'Option 2', votes: 0 },
                { id: 'opt3', text: 'Option 3', votes: 0 },
            ],
            allowMultiple: true,
        };

        render(<PollComponent pollData={pollData} />);

        // Click on multiple options
        const option1Button = screen.getByText('Option 1').closest('button');
        const option2Button = screen.getByText('Option 2').closest('button');

        fireEvent.click(option1Button!);
        fireEvent.click(option2Button!);

        // Submit button should show count
        const submitButton = screen.getByText(/Submit \(2 selected\)/i);
        expect(submitButton).toBeInTheDocument();

        // Submit the votes
        fireEvent.click(submitButton);

        // Results should be shown
        await waitFor(() => {
            expect(screen.getByText(/Results/i)).toBeInTheDocument();
        });
    });

    it('persists vote to localStorage', async () => {
        const pollData = {
            question: 'Test persistence',
            options: [
                { id: 'opt1', text: 'Option 1', votes: 0 },
                { id: 'opt2', text: 'Option 2', votes: 0 },
            ],
        };

        render(<PollComponent pollData={pollData} />);

        // Select and submit
        const option1Button = screen.getByText('Option 1').closest('button');
        fireEvent.click(option1Button!);

        const submitButton = screen.getByText(/Submit Vote/i);
        fireEvent.click(submitButton);

        // Check localStorage
        await waitFor(() => {
            const savedData = localStorage.getItem('poll_Test persistence');
            expect(savedData).toBeTruthy();

            if (savedData) {
                const parsed = JSON.parse(savedData);
                expect(parsed.selectedIds).toContain('opt1');
                expect(parsed.isSubmitted).toBe(true);
            }
        });
    });

    it('shows results when showResults is true', async () => {
        const pollData = {
            question: 'Display voting data',
            options: [
                { id: 'opt1', text: 'Option 1', votes: 0 },
                { id: 'opt2', text: 'Option 2', votes: 0 },
            ],
            showResults: true,
        };

        render(<PollComponent pollData={pollData} />);

        // Select and submit
        const option1Button = screen.getByText('Option 1').closest('button');
        fireEvent.click(option1Button!);

        const submitButton = screen.getByText(/Submit Vote/i);
        fireEvent.click(submitButton);

        // Results should be visible
        await waitFor(() => {
            expect(screen.getByText('Results')).toBeInTheDocument();
            expect(screen.getByText(/Total votes:/i)).toBeInTheDocument();
        });
    });

    it('hides results when showResults is false', async () => {
        const pollData = {
            question: 'Anonymous voting',
            options: [
                { id: 'opt1', text: 'Option 1', votes: 0 },
                { id: 'opt2', text: 'Option 2', votes: 0 },
            ],
            showResults: false,
        };

        render(<PollComponent pollData={pollData} />);

        // Select and submit
        const option1Button = screen.getByText('Option 1').closest('button');
        fireEvent.click(option1Button!);

        const submitButton = screen.getByText(/Submit Vote/i);
        fireEvent.click(submitButton);

        // Results section should not be visible
        await waitFor(() => {
            expect(screen.queryByText('Results')).not.toBeInTheDocument();
            expect(screen.queryByText(/Total votes:/i)).not.toBeInTheDocument();
        });
    });

    it('handles options without IDs by generating them', () => {
        const pollData = {
            question: 'No IDs test',
            options: [
                { text: 'Option 1', votes: 0 },
                { text: 'Option 2', votes: 0 },
            ],
        };

        render(<PollComponent pollData={pollData} />);

        // Should still render correctly
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
});
