#!/usr/bin/env python

import argparse
import shlex
import subprocess
from pathlib import Path

THIS_DIRECTORY = Path(__file__).parent


def run_verbose(cmd_args, *args, **kwargs):
    kwargs.setdefault('check', True)

    print(f"$ {shlex.join(cmd_args)}")
    subprocess.run(cmd_args, *args, **kwargs)


def cmd_py_distribute(args):
    run_verbose(['python', 'setup.py', 'bdist_wheel', '--universal', 'sdist'], cwd=THIS_DIRECTORY)


def cmd_js_build(args):
    run_verbose(['yarn', 'install'], cwd=THIS_DIRECTORY / "streamlit_ketcher" / "frontend")
    run_verbose(['yarn', 'build'], cwd=THIS_DIRECTORY / "streamlit_ketcher" / "frontend")


def cmd_package(args):
    cmd_js_build(args)
    cmd_py_distribute(args)


def get_parser():
    parser = argparse.ArgumentParser(prog="airflow")
    subparsers = parser.add_subparsers(dest="subcommand", metavar="COMMAND")
    subparsers.required = True
    subparsers.add_parser(
        'py-distribution', help='Create Python distribution files in dist/.'
    ).set_defaults(func=cmd_py_distribute)
    subparsers.add_parser(
        'js-build', help='Build frontend.'
    ).set_defaults(func=cmd_js_build)
    subparsers.add_parser(
        'package', help='Build frontend and then run "py-distribution".'
    ).set_defaults(func=cmd_package)
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()
