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

    struct Node *previous = NULL;
    struct Node *current = head;

    /* Walk the list once and turn every link around, so each node points
       back at the node we came from instead of the node we go to. */
    while (current != NULL) {
        /* Remember the rest of the list before we change the link, because
           a changed link would lose the only way forward we had. */
        struct Node *ahead = current->next;
        /* Point this node back at the node we came from, because reversing means
           every link has to turn around. */
        current->next = previous;
        /* Remember where we came from, so the next node can point back too. */
        previous = current;
        /* Move on to the node we saved, so the walk carries on. */
        current = ahead;
    }

    /* The last node we visited is the new head, because that is the node
       that was at the end. */
    head = previous;

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
