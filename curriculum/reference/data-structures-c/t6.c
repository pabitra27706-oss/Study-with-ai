#include <stdio.h>
#include <stdlib.h>

/* A value and the address of the next node, so the list can grow one
   node at a time. */
struct Node {
    int data;
    struct Node *next;
};

int main(void) {
    int n;
    struct Node *head = NULL;

    scanf("%d", &n);

    /* One node per value, so the loop count is the number of values. */
    for (int i = 0; i < n; i++) {
        int value;
        struct Node *temp;
        scanf("%d", &value);

        /* Ask for room for exactly one node, because the list grows one
           element at a time and we do not know the final size yet. */
        temp = (struct Node *)malloc(sizeof(struct Node));

        /* Store the value, and leave the link empty for now, because we do
           not know yet which node this one has to point at. */
        temp->data = value;
        temp->next = NULL;

        if (head == NULL) {
            /* The list was empty, so the new node is the whole list. */
            head = temp;
        } else {
            struct Node *walk = head;
            /* Stop one node before the end, because that node's next
               pointer is the place the new node has to be attached. */
            while (walk->next != NULL) {
                /* Move one node forward, because the last node is the one we attach to. */
                walk = walk->next;
            }
            /* Attach the new node after the last one, so the order the
               values were read in is the order the list holds them in. */
            walk->next = temp;
        }
    }

    long long total = 0;
    struct Node *cursor = head;
    /* Add up every value as we walk the list, so we only walk it once. */
    while (cursor != NULL) {
        /* long long, because the sum of many ints can overflow an int. */
        total += cursor->data;
        /* Step to the next node, or stop, because a null next pointer means
           the list has ended. */
        cursor = cursor->next;
    }

    printf("%lld\n", total);

    /* Give every node back, so the program does not leak the memory. */
    while (head != NULL) {
        struct Node *dead = head;
        /* Save the next node first, because freeing this one loses its link. */
        head = head->next;
        free(dead);
    }

    return 0;
}
