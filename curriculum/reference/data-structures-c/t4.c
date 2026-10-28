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
    int count = 0;

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
        /* Count the node, so we know how many positions the list has. */
        count = count + 1;
    }

    int position;
    scanf("%d", &position);

    if (position < 1 || position > count) {
        /* The position is outside the list, so nothing is deleted and the
           list is printed exactly as it was built. */
    } else if (position == 1) {
        struct Node *dead = head;
        /* The head itself goes, so the list has to start at the second node. */
        head = head->next;
        /* Free the node, because memory is not given back on its own. */
        free(dead);
    } else {
        struct Node *walk = head;
        /* Stop on the node just before the one we delete, because that is
           the node whose link has to be re-pointed to the one after it. */
        for (int step = 1; step < position - 1; step++) {
            /* Count one node further along the list, because we need the node just
               before the position. */
            walk = walk->next;
        }
        struct Node *dead = walk->next;
        /* Cut the dead node out of the chain, so nothing points at it. */
        walk->next = dead->next;
        /* Free the node, because memory is not given back on its own. */
        free(dead);
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
