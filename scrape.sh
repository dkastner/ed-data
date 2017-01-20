#!/bin/bash
set -euo pipefail

tmux -c 'wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains ed.gov --no-parent http://ocrdata.ed.gov'
tmux -c 'wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains ed.gov --no-parent https://studentaid.ed.gov'
tmux -c 'wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains ed.gov --no-parent https://www.ed.gov'
