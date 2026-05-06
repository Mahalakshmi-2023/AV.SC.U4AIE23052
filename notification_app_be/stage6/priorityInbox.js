require("dotenv").config();

const axios = require("axios");

/*
Priority Weights

Placement = 3
Result = 2
Event = 1
*/

const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1
};

const TOP_N = 10;

/*
Min Heap Implementation
Efficiently maintains top 10 notifications
*/

class MinHeap {

    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    push(item) {
        this.heap.push(item);
        this.bubbleUp();
    }

    pop() {

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const top = this.heap[0];

        this.heap[0] = this.heap.pop();

        this.bubbleDown();

        return top;
    }

    bubbleUp() {

        let index = this.heap.length - 1;

        while (index > 0) {

            const parent = Math.floor((index - 1) / 2);

            if (this.heap[parent].score <= this.heap[index].score) {
                break;
            }

            [this.heap[parent], this.heap[index]] =
                [this.heap[index], this.heap[parent]];

            index = parent;
        }
    }

    bubbleDown() {

        let index = 0;

        const length = this.heap.length;

        while (true) {

            let left = 2 * index + 1;
            let right = 2 * index + 2;

            let smallest = index;

            if (
                left < length &&
                this.heap[left].score < this.heap[smallest].score
            ) {
                smallest = left;
            }

            if (
                right < length &&
                this.heap[right].score < this.heap[smallest].score
            ) {
                smallest = right;
            }

            if (smallest === index) {
                break;
            }

            [this.heap[index], this.heap[smallest]] =
                [this.heap[smallest], this.heap[index]];

            index = smallest;
        }
    }

    toSortedArrayDescending() {

        return this.heap
            .sort((a, b) => b.score - a.score);
    }
}

/*
Score Formula

Final Score =
Type Weight * 100000 +
Recency Score
*/

function calculateScore(notification) {

    const typeWeight =
        TYPE_WEIGHTS[notification.Type] || 0;

    const timestamp =
        new Date(notification.Timestamp).getTime();

    return (typeWeight * 1000000000000) + timestamp;
}

/*
Fetch Notifications API
*/

async function fetchNotifications(token) {

    try {

        const response = await axios.get(
            "http://20.207.122.201/evaluation-service/notifications",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data.notifications;

    } catch (error) {

        console.error("API Error:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        return [];
    }
}

/*
Maintain Top 10 Efficiently
Using Min Heap
*/

function getTopNotifications(notifications) {

    const heap = new MinHeap();

    for (const notification of notifications) {

        const score =
            calculateScore(notification);

        const item = {
            ...notification,
            score
        };

        if (heap.size() < TOP_N) {

            heap.push(item);

        } else if (score > heap.peek().score) {

            heap.pop();

            heap.push(item);
        }
    }

    return heap.toSortedArrayDescending();
}

/*
Main Execution
*/

async function main() {

    const token = process.env.ACCESS_TOKEN;

    if (!token) {

        console.log(
            "ACCESS_TOKEN missing in .env file"
        );

        return;
    }

    console.log("\nFetching notifications...\n");

    const notifications =
        await fetchNotifications(token);

    console.log(
        `Total Notifications Received: ${notifications.length}\n`
    );

    const topNotifications =
        getTopNotifications(notifications);

    console.log("TOP 10 PRIORITY NOTIFICATIONS\n");

    topNotifications.forEach((notification, index) => {

        console.log(
            `#${index + 1}`
        );

        console.log(
            `Type      : ${notification.Type}`
        );

        console.log(
            `Message   : ${notification.Message}`
        );

        console.log(
            `Timestamp : ${notification.Timestamp}`
        );

        console.log(
            `Score     : ${notification.score}`
        );

        console.log("-----------------------------------");
    });
}

main();