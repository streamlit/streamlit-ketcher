#!/usr/bin/env python

import argparse
import shlex
import subprocess
from pathlib import Path

THIS_DIRECTORY = Path(__file__).parent
VENV_DIRECTORY = THIS_DIRECTORY / "venv"
PYTHON_BIN = VENV_DIRECTORY / "bin" / "python"


def run_verbose(cmd_args, *args, **kwargs):
    kwargs.setdefault("check", True)

    print(f"$ {shlex.join(cmd_args)}")
    subprocess.run(cmd_args, *args, **kwargs)


def ensure_environment():
    try:
        subprocess.check_call(
            ["python", "-m", "venv", "--help"],
            stderr=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError:
        raise SystemExit("'venv' python module is not installed")

    if not PYTHON_BIN.exists():
        shell_cmd = shlex.join([str(__file__), "py-create-venv"])
        raise SystemExit(
            "The virtual environment is not exists.\n"
            "To create environment run:"
            f"   $ {shell_cmd}"
        )

    try:
        subprocess.check_call(
            ["node", "--version"], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL
        )
    except subprocess.CalledProcessError:
        raise SystemExit("'node' is not installed")

    try:
        subprocess.check_call(
            ["yarn", "--version"], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL
        )
    except subprocess.CalledProcessError:
        raise SystemExit("'yarn' is not installed")


def cmd_py_create_venv(args):
    run_verbose(["python", "-m", "venv", str(VENV_DIRECTORY)], cwd=THIS_DIRECTORY)
    run_verbose(
        [
            str(PYTHON_BIN),
            "-m",
            "pip",
            "install",
            "-r",
            str(THIS_DIRECTORY / "dev-requirements.txt"),
        ],
        cwd=THIS_DIRECTORY,
    )


def cmd_py_distribute(args):
    run_verbose(
        [str(PYTHON_BIN), "setup.py", "bdist_wheel", "--universal", "sdist"],
        cwd=THIS_DIRECTORY,
    )


def cmd_js_build(args):
    run_verbose(["yarn", "install"], cwd=THIS_DIRECTORY / "frontend")
    run_verbose(["yarn", "build"], cwd=THIS_DIRECTORY / "frontend")


def cmd_package(args):
    cmd_js_build(args)
    cmd_py_distribute(args)


def get_parser():
    parser = argparse.ArgumentParser(prog="airflow")
    subparsers = parser.add_subparsers(dest="subcommand", metavar="COMMAND")
    subparsers.required = True
    subparsers.add_parser(
        "py-distribution", help="Create Python distribution files in dist/."
    ).set_defaults(func=cmd_py_distribute)
    subparsers.add_parser("js-build", help="Build frontend.").set_defaults(
        func=cmd_js_build
    )
    subparsers.add_parser(
        "package", help='Build frontend and then run "py-distribution".'
    ).set_defaults(func=cmd_package)
    subparsers.add_parser(
        "py-create-venv", help="Create virtual environment for Python."
    ).set_defaults(func=cmd_py_create_venv)
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()

    print(args.subcommand)
    if args.subcommand != "py-create-venv":
        ensure_environment()
    args.func(args)


if __name__ == "__main__":
    main()
