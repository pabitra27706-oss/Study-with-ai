#include <stdio.h>
#include <stdlib.h>

/* A value and the address of the next node, so the list can grow one
   node at a time without knowing the size in advance. */
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

        /* Store the value, and point the new node at the old head, so
           the whole old list now hangs off the new node. */
        temp->data = value;
        temp->next = head;

        /* The new node becomes the head, so the list grows at the front
           and the values end up in the reverse of the order read. */
        head = temp;
    }

    struct Node *cursor = head;
    /* Print from the head, one value per line, because the head is where
       the list starts. */
    while (cursor != NULL) {
        printf("%d\n", cursor->data);
        /* Step to the next node, or stop, because a null next pointer means
           the list has ended. */
        cursor = cursor->next;
    }

    /* Give every node back, so the program does not leak the memory. */
    while (head != NULL) {
        struct Node *dead = head;
        /* Save the next node first, because freeing this one loses its link. */
        head = head->next;
        free(dead);
    }

    return 0;
}
