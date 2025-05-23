#!/usr/bin/bash

for w in "45978d37a68095c388313726d0e1371ac40c02f5" "943e0a06382fd2f549bd2baf9392a1bfb877fc29" "a4f4d990611bfbb38756f804d5afc33f36ca0dce" "eb7d60d91c15e119aa36bc8987abaf81b218bc89" "6f1e25fd9c3a887fa25d0ea00a073ff2aaa5bd8b" "f5cdf9f6624fc8f1413558a913649e43ee189f03" "32edceba510f44eb18f143c8da4cd3d8699dfd57" "f15dd762c3f894be49711a5f1687b34848efe779"
do
    echo "for commit $w"
    git show "$w:resources/js/types/index.d.ts" | grep -n LoginProps
done