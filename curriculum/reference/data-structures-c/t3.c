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
            /* Attach the new node at the end, so the order the values
               were read in is the order the list holds them in. */
            walk->next = temp;
        }
    }

    int position, value;
    scanf("%d %d", &position, &value);

    struct Node *fresh = (struct Node *)malloc(sizeof(struct Node));
    /* Store the new value in its own node, so the old nodes stay intact. */
    fresh->data = value;

    if (position <= 1) {
        /* The new value goes in front, so it has to point at the old head. */
        fresh->next = head;
        /* The new node becomes the head, so it is now the first element. */
        head = fresh;
    } else {
        struct Node *walk = head;
        /* Stop on the node just before the position, because that is the
           node whose link we have to cut and re-point to the new node. */
        for (int step = 1; step < position - 1 && walk->next != NULL; step++) {
            /* Count one node further along the list, because we need the node just
               before the position. */
            walk = walk->next;
        }
        /* The new node takes over the place of the node after walk, because
           that is where it belongs. */
        fresh->next = walk->next;
        /* Re-point walk at the new node, so the chain stays unbroken. */
        walk->next = fresh;
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
