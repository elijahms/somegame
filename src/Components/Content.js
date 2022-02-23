import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import KeyBoard from "./KeyBoard";
import Cell from "./Cell";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { WORDS } from "../Constants/wordlist";
import { useCookies } from "react-cookie";
import Dialog from "./DialogS";
import NavBar from "./NavBar";

function Content() {
  const [cookies, setCookie] = useCookies(["word"]);
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [notInWord, setNotInWord] = useState([]);
  const [snackMessage, setSnackMessage] = useState("Not in Word List");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const [answer, setAnswer] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [winningText, setWinningText] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [lostGame, setLostGame] = useState(false);

  // const [guessObj, setGuessObj] = useState({
  //   boxes: [],
  //   guesses: [],
  //   currentRow: 0,
  //   notInWord: [],
  //   word: "",
  // });

  useEffect(() => {
    if (word !== "" || currentRow !== 0) {
      localStorage.setItem("guess", JSON.stringify(guess));
      localStorage.setItem("boxes", JSON.stringify(boxes));
      localStorage.setItem("word", JSON.stringify(word));
      localStorage.setItem("currentRow", JSON.stringify(currentRow));
      localStorage.setItem("notInWord", JSON.stringify(notInWord));
      localStorage.setItem("gameWon", JSON.stringify(wonGame));
    }
  }, [word, currentRow]);

  useEffect(() => {
    if (!cookies.word) {
      localStorage.clear();
      let expiration = new Date();
      expiration.setHours(23, 59, 59, 999);
      let syncedAnswer = dayOfYear(new Date());
      syncedAnswer = WORDS[Math.floor((syncedAnswer / 365) * WORDS.length)];
      console.log(syncedAnswer);
      //let todaysAnswer = WORDS[Math.floor(Math.random() * WORDS.length)];
      setCookie("word", syncedAnswer, {
        path: "/",
        expires: expiration,
        secure: true,
        sameSite: "strict",
      });
      setAnswer(syncedAnswer);
      localStorage.setItem("guess", JSON.stringify([]));
      localStorage.setItem("boxes", JSON.stringify([]));
      localStorage.setItem("word", JSON.stringify(""));
      localStorage.setItem("currentRow", JSON.stringify(0));
      localStorage.setItem("notInWord", JSON.stringify([]));
      localStorage.setItem("gameWon", "false");
    } else {
      setAnswer(cookies.word);
      let savedGuess = localStorage.getItem("guess");
      let savedBoxes = localStorage.getItem("boxes");
      let savedWord = localStorage.getItem("word");
      let savedCurrentRow = localStorage.getItem("currentRow");
      let savedNotInWord = localStorage.getItem("notInWord");
      setGuess(JSON.parse(savedGuess));
      setBoxes(JSON.parse(savedBoxes));
      setWord(JSON.parse(savedWord));
      setNotInWord(JSON.parse(savedNotInWord));
      setCurrentRow(JSON.parse(savedCurrentRow));
      if (localStorage.getItem("gameWon") === "true") {
        gameWon();
      }
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const dayOfYear = (date) =>
    Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );

  function Enterword(e) {
    if (e.target.value === "⬅") {
      if (word.length > 0) {
        setWord(() => word.slice(0, -1));
        //setGuessObj({ ...guessObj, word: word.slice(0, -1) });
      }
    } else if (e.target.value === "⏎") {
      if (word.length === 5) {
        checkAnswer();
      } else {
        setSnackMessage("Not Long Enough");
        setOpenSnackBar(true);
      }
    } else {
      if (word.length <= 4 && word.length >= 0) {
        setWord(() => word + e.target.value);
        //setGuessObj({ ...guessObj, word: word + e.target.value });
      }
    }
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const shareWin = () => {
    let shareabletext = [
      boxes.flat().map((c) => {
        if (c === "green") {
          return "🟩";
        } else if (c === "orange") {
          return "🟧";
        } else {
          return "⬛";
        }
      }),
      "🟩",
      "🟩",
      "🟩",
      "🟩",
      "🟩",
    ];
    shareabletext = shareabletext
      .flat()
      .map((m, i) => (i % 5 === 0 ? "\n" + m : m))
      .join("");
    return shareabletext;
  };

  const gameWon = () => {
    setWonGame(true);
    setDialogContent("winner winner winner");
    setDialogTitle("You Won!");
    setWinningText(shareWin());
    handleClickOpenDialog();
  };

  const gameLost = () => {
    setLostGame(true);
    setDialogContent("loser loser loser");
    setDialogTitle("You Lost!");
    handleClickOpenDialog();
  };

  const invalidWord = () => {
    setSnackMessage("Not in Word List");
    setOpenSnackBar(true);
  };

  //   const checkAnswer = () => {
  //     let currentBoxes = [];
  //     let letnotinword = [];
  //     let correctCount = 0;
  //     if (WORDS.includes(word)) {
  //       setCurrentRow(currentRow + 1);
  //       setGuess([...guess, word]);
  //       if (word === answer) {
  //         word.split("").map(() => currentBoxes.push("green"));
  //         setBoxes([...boxes, currentBoxes]);
  //         setWord("");
  //         gameWon();
  //       } else {
  //         word.split("").map((letter, index) => {
  //           if (answer.includes(letter)) {
  //             if (answer[index] === letter) {
  //               correctCount++;
  //               return currentBoxes.push("green");
  //             } else {
  //               return currentBoxes.push("orange");
  //             }
  //           } else {
  //             return currentBoxes.push("gray"), letnotinword.push(letter);
  //           }
  //         });
  //         setBoxes([...boxes, currentBoxes]);
  //         setNotInWord([...notInWord, letnotinword]);
  //         let checkrow = parseInt(currentRow) + 1;
  //         if (checkrow >= 6) {
  //           gameLost();
  //         } else {
  //           setWord("");
  //         }
  //       }
  //     } else {
  //       setSnackMessage("Not in Word List");
  //       setOpenSnackBar(true);
  //     }
  //   };

  const checkAnswer = () => {
    if (WORDS.includes(word)) {
      let currentBoxes = [];
      let charNotInWord = [];
      let correctCount = 0;
      word.split("").map((letter, index) => {
        if (answer.includes(letter)) {
          if (answer[index] === letter) {
            correctCount++;
            return currentBoxes.push("green");
          } else {
            return currentBoxes.push("orange");
          }
        } else {
          return currentBoxes.push("gray"), charNotInWord.push(letter);
        }
      });
      setCurrentRow(currentRow + 1);
      setGuess([...guess, word]);
      setBoxes([...boxes, currentBoxes]);
      setNotInWord([...notInWord, charNotInWord]);
      correctCount === 5 && gameWon();
      currentRow + 1 >= 6 ? gameLost() : setWord("");
    } else {
      invalidWord();
    }
  };

  function CellLayout() {
    return [...Array(6)].map((stack, s) => {
      return (
        <Stack
          sx={{ mb: 0.5 }}
          key={s}
          justifyContent="center"
          direction="row"
          spacing={1}
        >
          {[...Array(5)].map((cell, c) => {
            let row = Math.floor((c + 5 * s) / 5);
            return (
              <Cell
                key={c}
                row={row}
                guess={guess[row]}
                placement={c}
                currentRow={currentRow}
                word={word}
                boxes={boxes[row]}
              />
            );
          })}
        </Stack>
      );
    });
  }

  return (
    <Container maxWidth="sm">
      <NavBar />
      <CellLayout />
      <KeyBoard
        Enterword={Enterword}
        notInWord={notInWord}
        wonGame={wonGame}
        lostGame={lostGame}
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={1000}
        onClose={handleClose}
        message={snackMessage}
      />
      <Dialog
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        winningText={winningText}
        wonGame={wonGame}
      />
    </Container>
  );
}

export default Content;
