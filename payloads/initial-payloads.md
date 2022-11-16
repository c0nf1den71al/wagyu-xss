---
description: Setting initial payloads when creating implants within the Wagyu client
---

# Initial Payloads

Initial payloads can be set when creating an implant (see the image below for reference):

<div>

<figure><img src="../.gitbook/assets/client-initial-payloads.png" alt=""><figcaption><p>Initial Payload</p></figcaption></figure>

 

<figure><img src="../.gitbook/assets/payloads-table.png" alt=""><figcaption><p>Payloads Table</p></figcaption></figure>

</div>

Initial payloads are payloads which are executed when a host is first registered. This is useful for tasks which you may want to perform straight away such as information gathering or reconnaissance.

When a host is registered the server will send the host its initial payload, the host will then execute this command respond with the results during the first callback.
